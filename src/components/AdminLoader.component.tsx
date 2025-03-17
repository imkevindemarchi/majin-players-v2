import React, { FC } from "react";
import { MoonLoader as Spinner } from "react-spinners";

const AdminLoader: FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center min-h-[70vh]">
      <Spinner size={50} color="#f37c90" />
    </div>
  );
};

export default AdminLoader;
