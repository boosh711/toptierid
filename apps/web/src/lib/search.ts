import { prisma, Prisma } from "@top-tier-id/database";

export async function searchAthletes(params: {
  q?: string;
  position?: string;
  gradYear?: number;
  gpaMin?: number;
  gpaMax?: number;
  state?: string;
  club?: string;
  page?: number;
}) {
  const page = params.page ?? 1;
  const perPage = 20;
  const where: Prisma.AthleteProfileWhereInput = {
    isPublished: true,
  };

  if (params.position) where.position = params.position;
  if (params.gradYear) where.gradYear = params.gradYear;
  if (params.state) where.state = params.state;
  if (params.club) where.club = { contains: params.club, mode: "insensitive" };
  if (params.gpaMin != null || params.gpaMax != null) {
    where.gpa = {};
    if (params.gpaMin != null) where.gpa.gte = params.gpaMin;
    if (params.gpaMax != null) where.gpa.lte = params.gpaMax;
  }

  if (params.q) {
    where.OR = [
      { slug: { contains: params.q, mode: "insensitive" } },
      { club: { contains: params.q, mode: "insensitive" } },
      { highSchool: { contains: params.q, mode: "insensitive" } },
      {
        user: {
          OR: [
            { firstName: { contains: params.q, mode: "insensitive" } },
            { lastName: { contains: params.q, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.athleteProfile.findMany({
      where,
      include: { user: true },
      orderBy: [{ isPremium: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.athleteProfile.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}
