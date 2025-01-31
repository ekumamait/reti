import { Spin } from "antd";

export default function Loader() {

  return (
	<div className="flex items-center justify-center h-screen">
	<Spin size="large" />
</div>
  );
}