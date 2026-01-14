import Image from "next/image";
import React from "react";
const Footer = () => {
  return (
    <div className="relative bg-gray-100 dark:bg-zinc-900 w-full border-t dark:border-zinc-800" id="footer">
      <div className="flex flex-col lg:flex-row p-[40px] lg:px-[170px] gap-8">
        <div className="lg:w-[500px]">
          <div>
            <h1 className="font-bold my-2 text-foreground">FAQs</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discount, Service commitment, Feedback, How to use Buypoint pay,
              Wish List, Store,<br></br> Cart, Coupon
            </p>
          </div>
          <div>
            <h1 className="font-bold my-2 text-foreground">Browse by Category</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Holders & Stands, Necklace, Dresses, Rings, Shoulder Bags,
              Bottoms, Hair Weft & Closure, Baby's Sets
            </p>
          </div>
          <div>
            <h1 className="font-bold my-2 text-foreground">About Buypoint </h1>
            <p className="text-gray-600 dark:text-gray-400">Privacy Policy</p>
          </div>

          <div className="flex gap-4 my-2">
            <div>
              <Image
                src={"/goggle.png"}
                alt="J-will"
                width={100}
                height={100}
                className="dark:invert dark:opacity-80"
              />
            </div>
            <div>
              <Image
                src={"/appstore.png"}
                alt="Buy-Point"
                width={100}
                height={100}
                className="dark:invert dark:opacity-80"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div>
            <h1 className="font-bold my-2 text-foreground">Countries We Operate</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ethiopia, Tanzania, Uganda, Ghana, Nigeria, Cameroon, D.R.Congo,
              Zambia,<br></br> Congo, Cote d Ivoire, Senegal, Gabon, Mali,
              Kenya, Rwanda, South Africa, <br></br> Brazil, Chile, Mexico,
              Benin, Togo, Burkina Faso, Malawi, Botswana, Germany<br></br>
            </p>
          </div>
          <div className="mt-4">
            <h1 className="font-bold mb-4 text-foreground">Contact Us</h1>
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
              <h1 className="font-semibold text-foreground">Address:</h1>
              <span>Delta State Nigeria</span>
            </div>
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
              <h1 className="font-semibold text-foreground">Phone:</h1>
              <span>09074995174</span>
            </div>
            <div className="flex gap-2 text-gray-600 dark:text-gray-400">
              <h1 className="font-semibold text-foreground">Email:</h1>
              <span>Igwedejethro@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
