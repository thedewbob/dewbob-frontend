import { Header } from "./header";
import { getMenuByLocation, getSiteSettings, getCategories } from "@/lib/directus";

export async function HeaderWrapper() {
  // Fetch menu and site settings from Directus
  const menu = await getMenuByLocation('header', 'dewbob');
  const settings = await getSiteSettings('dewbob');
  const categories = await getCategories();

  return <Header menu={menu} settings={settings} categories={categories} />;
}
