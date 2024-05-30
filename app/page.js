import BusinessList from "./_components/BusinessList";
import CategoryList from "./_components/CategoryList";

export default function Home() {
  return (
    <div>
      <CategoryList />
      <BusinessList />
    </div>
  );
}
