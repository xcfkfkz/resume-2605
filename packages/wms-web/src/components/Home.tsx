import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      首页
      <Link to="/shelfs">前往货架</Link>
      <Link to="/products">前往库存管理</Link>
    </div>
  );
}
