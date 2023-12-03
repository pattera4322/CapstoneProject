import React from "react";

const RelatedNews = () => {
  return (
    <div className="">
      <div className="text-base text-left p-4 overflow-y-auto">
        <p className="pb-4">Related News</p>
        <div className="text-base text-left p-4 overflow-y-auto bg-gray-200 rounded-lg">
          <div className="message">
            <p className="pb-2 font-bold">อินเดียประกาศส่งออกข้าวนาาา</p>
            <p className="text-sm"> Posted Date XX/XX/XX</p>
          </div>
        </div>
        <br />
        <div className="text-base text-left p-4 overflow-y-auto bg-gray-200 rounded-lg">
          <div className="message">
            <p className="pb-2 font-bold">ด่วน!! มายใส่ชุดเมท รีบดูก่อนโดนลบ</p>
            <p className="text-sm"> Posted Date XX/XX/XX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedNews;
