import Image from "next/image";
import React from "react";
const Footer = () => {
  return (
    <div className="relative bg-gray-300 w-full  " id="footer">
      <div className="flex p-[20px]  ml-[170px]">
        <div className="w-[500px]">
          <div>
            <h1 className="font-bold my-2 ">FAQs</h1>
            <p>
              Discount, Service commitment, Feedback, How to use Buypoint pay,
              Wish List, Store,<br></br> Cart, Coupon
            </p>
          </div>
          <div>
            <h1 className="font-bold my-2 ">Browse by Category</h1>
            <p>
              Holders & Stands, Necklace, Dresses, Rings, Shoulder Bags,
              Bottoms, Hair Weft & Closure, Baby's Sets
            </p>
          </div>
          <div>
            <h1 className="font-bold my-2 ">About Buypoint </h1>
            <p>Privacy Policy</p>
          </div>

          <div className="flex gap-4 my-2">
            <div>
              <Image
                src={"/goggle.png"}
                alt="J-will"
                width={100}
                height={100}
              />
            </div>
            <div>
              <Image
                src={"/appstore.png"}
                alt="Buy-Point"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div>
            <h1 className="font-bold my-2 ">Countries We Operate</h1>
            <p>
              Ethiopia, Tanzania, Uganda, Ghana, Nigeria, Cameroon, D.R.Congo,
              Zambia,<br></br> Congo, Cote d Ivoire, Senegal, Gabon, Mali,
              Kenya, Rwanda, South Africa, <br></br> Brazil, Chile, Mexico,
              Benin, Togo, Burkina Faso, Malawi, Botswana, Germany<br></br>
            </p>
          </div>
          <div>
            <h1 className="font-bold mb-4 ">Contact Us</h1>
            <div className="flex gap-2">
              <h1>Address:</h1>
              <span>Delta State Nigeria</span>
            </div>
            <div className="flex gap-2">
              <h1>phone:</h1>
              <span>09074995174</span>
            </div>
            <div className="flex gap-2">
              <h1>Email:</h1>
              <span>Igwedejethro@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
