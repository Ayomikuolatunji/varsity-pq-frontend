import React from "react";

const NewsCard = ({ data }) => {
  return (
    <div
      key={data.id}
      className="flex flex-col rounded-md border px-3 pt-3 pb-4"
      data-aos="fade-left"
    >
      <h3 className="mb-2 text-lg font-semibold lg:text-base">
        {data.title.substr(0, 50)}...
      </h3>
      <p className="mb-7 text-base italic text-gray-500">{data.published}</p>
      <div>
        <a
          href={data.link}
          target={"_blank"}
          className="grid place-items-center rounded border py-2 px-3 text-black duration-200 hover:text-blue-500"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
