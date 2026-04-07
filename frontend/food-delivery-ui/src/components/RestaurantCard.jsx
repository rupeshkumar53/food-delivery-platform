import { useState } from "react";

const RestaurantCard = ({
  id,
  name,
  cuisine,
  imageUrl,
  rating,
  deliveryTime,
  distance,
  minOrder,
  discount,
  isVeg,
  isNew,
  isPopular,
  isOpen = true,
  onOrder,
}) => {
  const [isFav, setIsFav] = useState(false);

  return (
    <div className="relative bg-[#191818] rounded-2xl overflow-hidden border border-[#2a2929] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,92,26,0.27)] group">

      {/* Closed Overlay */}
      {!isOpen && (
        <div className="absolute inset-0 z-10 bg-[#0f0e0ecc] backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <span className="text-white font-bold text-xl tracking-widest uppercase opacity-90">
            Closed
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#191818]" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {isVeg !== undefined && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                isVeg
                  ? "bg-[#1a3a1a] text-green-400 border-green-500/30"
                  : "bg-[#3a1a1a] text-red-400 border-red-400/30"
              }`}
            >
              {isVeg ? "Veg" : "Non-Veg"}
            </span>
          )}
          {isNew && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ff5c1a] text-white uppercase tracking-wider">
              New
            </span>
          )}
          {isPopular && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-yellow-400 text-black uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Favourite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-[#191818]/80 backdrop-blur-md border border-[#2a2929] transition-transform hover:scale-110"
        >
          <span className="text-lg">{isFav ? "🧡" : "🤍"}</span>
        </button>

        {/* Discount Tag */}
        {discount && (
          <div className="absolute bottom-0 right-4 bg-[#ff5c1a] text-white text-xs font-bold px-3 py-1 rounded-t-lg tracking-wide uppercase">
            {discount}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="px-4 pt-3 pb-5">
        {/* Name */}
        <h3 className="font-bold text-lg text-[#f0eeea] truncate mb-1">
          {name}
        </h3>

        {/* Cuisine */}
        <p className="text-sm text-[#888] font-light mb-3">{cuisine}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-1.5 bg-[#1e3a1e] px-2.5 py-1 rounded-full">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-green-400 text-sm font-semibold">{rating}</span>
          </div>

          <span className="text-[#444] text-xs">●</span>

          <span className="text-[#aaa] text-sm">⏱ {deliveryTime} min</span>

          <span className="text-[#444] text-xs">●</span>

          <span className="text-[#aaa] text-sm">📍 {distance} km</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#2a2929] mb-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#666]">
            Min. order{" "}
            <span className="text-[#ccc] font-medium">₹{minOrder}</span>
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isOpen && onOrder) onOrder(id);
            }}
            disabled={!isOpen}
            className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
              isOpen
                ? "bg-[#ff5c1a] text-white hover:bg-[#ff7a3d] hover:scale-105"
                : "bg-[#2a2929] text-[#555] cursor-not-allowed"
            }`}
          >
            {isOpen ? "Order Now" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;