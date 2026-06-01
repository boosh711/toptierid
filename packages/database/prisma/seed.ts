import { PrismaClient, UserRole, NoteVisibility } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "demo1234";

async function main() {
  await prisma.message.deleteMany();
  await prisma.threadParticipant.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.calendarWatch.deleteMany();
  await prisma.contactRequest.deleteMany();
  await prisma.coachNote.deleteMany();
  await prisma.coachFavorite.deleteMany();
  await prisma.profileView.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.scheduleEvent.deleteMany();
  await prisma.collegeGoals.deleteMany();
  await prisma.parentLink.deleteMany();
  await prisma.programMembership.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash(PASSWORD, 10);

  const program = await prisma.program.create({
    data: {
      name: "Eagles Women's Soccer",
      college: "State University",
      sport: "soccer",
    },
  });

  const coachUsers = await Promise.all(
    [
      { email: "coach.head@demo.com", firstName: "Sarah", lastName: "Mitchell", title: "Head Coach" },
      { email: "coach.asst@demo.com", firstName: "James", lastName: "Rivera", title: "Assistant Coach" },
      { email: "coach2@demo.com", firstName: "Amy", lastName: "Chen", title: "Head Coach" },
      { email: "coach3@demo.com", firstName: "Mike", lastName: "Torres", title: "Recruiting Coordinator" },
      { email: "coach4@demo.com", firstName: "Lisa", lastName: "Park", title: "Assistant" },
    ].map((c, i) => {
      const { title, ...userFields } = c;
      return prisma.user.create({
        data: {
          ...userFields,
          role: UserRole.COACH,
          passwordHash: hash,
          coachProfile: {
            create: {
              college: i < 2 ? "State University" : ["Tech College", "Valley U", "Coastal U"][i - 2],
              title,
              isVerified: true,
              programId: i < 2 ? program.id : undefined,
            },
          },
        },
        include: { coachProfile: true },
      });
    })
  );

  for (const u of coachUsers.slice(0, 2)) {
    if (u.coachProfile) {
      await prisma.programMembership.create({
        data: {
          programId: program.id,
          coachProfileId: u.coachProfile.id,
          role: u.coachProfile.title === "Head Coach" ? "head" : "assistant",
        },
      });
    }
  }

  const positions = ["GK", "CB", "LB", "CM", "CAM", "LW", "RW", "ST"];
  const clubs = ["ECNL Thunder FC", "GA United", "NPL Elite", "City SC Academy", "Metro United"];
  const states = ["TX", "CA", "FL", "NC", "GA", "VA", "OH", "NJ"];

  const athleteData = Array.from({ length: 25 }, (_, i) => {
    const first = ["Emma", "Olivia", "Ava", "Sophia", "Mia", "Isabella", "Charlotte", "Amelia", "Harper", "Evelyn", "Luna", "Camila", "Gianna", "Abigail", "Ella", "Scarlett", "Victoria", "Aria", "Grace", "Chloe", "Penelope", "Layla", "Riley", "Zoey", "Nora"][i];
    const last = ["Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young"][i];
    return {
      email: `athlete${i + 1}@demo.com`,
      firstName: first,
      lastName: last,
      slug: `${first.toLowerCase()}-${last.toLowerCase()}-${i + 1}`,
      position: positions[i % positions.length],
      gradYear: 2025 + (i % 4),
      gpa: 3.2 + (i % 8) * 0.1,
      club: clubs[i % clubs.length],
      state: states[i % states.length],
      isPremium: i < 5,
      isPublished: true,
    };
  });

  const athletes = [];
  for (const a of athleteData) {
    const user = await prisma.user.create({
      data: {
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        role: UserRole.ATHLETE,
        passwordHash: hash,
        athleteProfile: {
          create: {
            slug: a.slug,
            position: a.position,
            gradYear: a.gradYear,
            gpa: a.gpa,
            club: a.club,
            state: a.state,
            city: "Demo City",
            highSchool: `${a.lastName} High School`,
            bio: `${a.firstName} is a dedicated ${a.position} with strong technical ability and leadership on the field.`,
            isPremium: a.isPremium,
            isPublished: a.isPublished,
            onboardingStep: 6,
            primaryColor: "#1E6BD6",
            secondaryColor: "#0B1F3A",
            collegeGoals: {
              create: {
                divisions: ["D1", "D2"],
                regions: ["Southeast", "Northeast"],
                targetSchools: ["State University", "Tech College"],
              },
            },
          },
        },
      },
      include: { athleteProfile: true },
    });
    athletes.push(user);
  }

  const demoAthlete = await prisma.user.create({
    data: {
      email: "athlete@demo.com",
      firstName: "Jordan",
      lastName: "Smith",
      role: UserRole.ATHLETE,
      passwordHash: hash,
      athleteProfile: {
        create: {
          slug: "jordan-smith",
          position: "CM",
          gradYear: 2027,
          gpa: 3.8,
          club: "ECNL Thunder FC",
          state: "TX",
          city: "Austin",
          highSchool: "Westlake High School",
          bio: "Central midfielder with vision, work rate, and NCAA eligibility on track.",
          instagramUrl: "https://instagram.com/jordansmithsoccer",
          tiktokUrl: "https://tiktok.com/@jordansmithsoccer",
          youtubeUrl: "https://youtube.com/@jordansmithhighlights",
          hudlUrl: "https://hudl.com/profile/12345678",
          xUrl: "https://x.com/jordansmithsoccer",
          isPremium: true,
          isPublished: true,
          onboardingStep: 6,
          primaryColor: "#1E6BD6",
          secondaryColor: "#0B1F3A",
          collegeGoals: {
            create: {
              divisions: ["D1"],
              regions: ["Southeast", "Southwest"],
              targetSchools: ["State University", "Tech College", "Valley U"],
            },
          },
        },
      },
    },
    include: { athleteProfile: true },
  });
  athletes.unshift(demoAthlete);

  const tournamentStart = new Date();
  tournamentStart.setDate(tournamentStart.getDate() + 7);
  tournamentStart.setHours(9, 0, 0, 0);

  for (const user of athletes) {
    const profile = user.athleteProfile!;
    await prisma.highlight.createMany({
      data: [
        {
          athleteProfileId: profile.id,
          title: "Season Highlights",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sortOrder: 0,
          mimeType: "video/mp4",
        },
        ...(profile.slug === "jordan-smith"
          ? [
              {
                athleteProfileId: profile.id,
                title: "Tournament Clip",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                sortOrder: 1,
                mimeType: "video/mp4",
              },
            ]
          : []),
      ],
    });

    const event1 = await prisma.scheduleEvent.create({
      data: {
        athleteProfileId: profile.id,
        title: "ECNL Showcase — Game 1",
        startsAt: new Date(tournamentStart),
        endsAt: new Date(tournamentStart.getTime() + 2 * 60 * 60 * 1000),
        opponent: "Metro United",
        venue: "Soccer Complex Field Complex",
        field: "Field 4",
        fieldNumber: "4",
        jerseyColor: "White",
        tournamentName: "ECNL Texas Showcase",
      },
    });

    await prisma.scheduleEvent.create({
      data: {
        athleteProfileId: profile.id,
        title: "ECNL Showcase — Game 2",
        startsAt: new Date(tournamentStart.getTime() + 24 * 60 * 60 * 1000),
        opponent: "City SC",
        venue: "Soccer Complex",
        field: "Field 2",
        fieldNumber: "2",
        jerseyColor: "Blue",
        tournamentName: "ECNL Texas Showcase",
      },
    });

    if (profile.slug === "jordan-smith") {
      const headCoach = coachUsers[0].coachProfile!;
      await prisma.coachFavorite.create({
        data: { coachProfileId: headCoach.id, athleteProfileId: profile.id },
      });
      await prisma.calendarWatch.create({
        data: {
          coachProfileId: headCoach.id,
          athleteProfileId: profile.id,
          scheduleEventId: event1.id,
          alertEnabled: true,
        },
      });
      await prisma.coachNote.create({
        data: {
          coachProfileId: headCoach.id,
          athleteProfileId: profile.id,
          body: "Excellent vision in transition. Track at ECNL showcase — strong left foot on set pieces.",
          visibility: NoteVisibility.PRIVATE,
        },
      });
      await prisma.profileView.createMany({
        data: coachUsers.slice(0, 3).map((c) => ({
          athleteProfileId: profile.id,
          coachProfileId: c.coachProfile!.id,
          viewerUserId: c.id,
        })),
      });
    }
  }

  const parents = await Promise.all(
    [
      { email: "parent@demo.com", firstName: "Chris", lastName: "Smith", athleteSlug: "jordan-smith" },
      { email: "parent2@demo.com", firstName: "Maria", lastName: "Johnson", athleteSlug: "emma-johnson-1" },
      { email: "parent3@demo.com", firstName: "David", lastName: "Williams", athleteSlug: "olivia-williams-2" },
    ].map(async (p) => {
      const user = await prisma.user.create({
        data: {
          email: p.email,
          firstName: p.firstName,
          lastName: p.lastName,
          role: UserRole.PARENT,
          passwordHash: hash,
        },
      });
      const athlete = await prisma.athleteProfile.findUnique({ where: { slug: p.athleteSlug } });
      if (athlete) {
        await prisma.parentLink.create({
          data: { parentUserId: user.id, athleteProfileId: athlete.id },
        });
      }
      return user;
    })
  );

  const jordan = await prisma.athleteProfile.findUnique({ where: { slug: "jordan-smith" } });
  const headCoach = coachUsers[0];
  if (jordan) {
    const thread = await prisma.messageThread.create({
      data: {
        subject: "Recruiting interest — State University",
        participants: {
          create: [{ athleteProfileId: jordan.id }],
        },
        messages: {
          create: [
            {
              senderId: headCoach.id,
              body: "Hi Jordan — I enjoyed your highlights. Will you be at the ECNL Texas Showcase this weekend?",
            },
            {
              senderId: demoAthlete.id,
              body: "Thank you, Coach Mitchell! Yes, we'll be there — Game 1 on Field 4 Saturday morning.",
            },
          ],
        },
      },
    });
    void thread;
  }

  console.log("Seed complete. Demo password for all accounts:", PASSWORD);
  console.log("Athlete: athlete@demo.com");
  console.log("Parent: parent@demo.com");
  console.log("Coach: coach.head@demo.com");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
