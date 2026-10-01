import { resolveTheme, type ProfileTheme } from "@/lib/profile-theme";
import { queryData } from "./db";

/**
 * Appearance for one tenant. Falls back to the industry suggestion, so a
 * business that has never opened the editor still looks deliberate rather
 * than default.
 */
export async function getProfileTheme(slug: string, category: string): Promise<ProfileTheme> {
  return queryData<ProfileTheme>(
    "profile-theme",
    async (prisma) => {
      const b = await prisma.business.findUnique({
        where: { slug },
        select: {
          themeKey: true, fontKey: true, layoutKey: true, buttonStyle: true,
          motionLevel: true, brandColor: true, logoUrl: true, coverUrl: true,
          headingFont: true, corners: true, logoShape: true,
          bgColor: true, surfaceColor: true, textColor: true,
        },
      });
      if (!b) return resolveTheme(category);

      return resolveTheme(category, {
        theme: b.themeKey as ProfileTheme["theme"],
        font: b.fontKey as ProfileTheme["font"],
        layout: b.layoutKey as ProfileTheme["layout"],
        buttons: b.buttonStyle as ProfileTheme["buttons"],
        motion: b.motionLevel as ProfileTheme["motion"],
        accent: b.brandColor,
        bg: b.bgColor ?? undefined,
        surface: b.surfaceColor ?? undefined,
        text: b.textColor ?? undefined,
        headingFont: (b.headingFont ?? undefined) as ProfileTheme["headingFont"],
        corners: b.corners as ProfileTheme["corners"],
        logoShape: b.logoShape as ProfileTheme["logoShape"],
        logoUrl: b.logoUrl ?? undefined,
        coverUrl: b.coverUrl ?? undefined,
      });
    },
    resolveTheme(category)
  );
}
