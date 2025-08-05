import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import StyleDropdown from "./StyleDropdown";

const PRODUCTS = ["tshirt", "hoodie", "sleevie", "cap"];
const BUILDS = ["lean", "reg", "athletic", "big"];

export default function Product() {
  const [productType, setProductType] = useState("tshirt");
  const [image, setImage] = useState(null);
  const [height, setHeight] = useState("180cm");
  const [weight, setWeight] = useState("80kg");
  const [build, setBuild] = useState("athletic");
  const [text, setText] = useState("");
  const [layout, setLayout] = useState(0); // 0 = default, 1, 2 = other layouts

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "q") {
        setLayout((prev) => (prev + 1) % 3);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

useEffect(() => {
  const originalBg = document.body.style.backgroundColor;
  document.body.style.backgroundColor = layout === 1 ? 'maroon' : '#800000';

  return () => {
    document.body.style.backgroundColor = originalBg; // restore original color on unmount
  };
}, [layout]);

  const layoutStyles = [
    "bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800",
    "bg-gradient-to-br from-red-50 to-red-200 text-yellow-900",
    "bg-gradient-to-br from-zinc-800 to-zinc-900 text-white"
  ];

  const containerShadow = layout === 2 ? "bg-zinc-800 shadow-lg" : "bg-white shadow";

  return (
    <div className={`min-h-screen ${layoutStyles[layout]} font-sans space-y-6 p-6`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Section: Dropzone and Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed border-gray-400 rounded p-8 text-center cursor-pointer h-full ${containerShadow}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag 'n' drop an image here, or click to select</p>
            )}
          </div>

          {/* Height, Weight, Build Dropdown */}
          <div className={`${containerShadow} p-4 rounded`}>
            <label className="block font-semibold mb-1">Height</label>
            <input
  className={`w-[200px] border rounded px-3 py-2 mb-3 ${
    layout === 2
      ? "bg-zinc-700 border-gray-500 text-white placeholder-gray-300"
      : "border-gray-300 text-black"
  }`}
  value={height}
  onChange={(e) => setHeight(e.target.value)}
/>

            <label className="block font-semibold mb-1">Weight</label>
           <input
  className={`w-[200px] border rounded px-3 py-2 mb-3 ${
    layout === 2
      ? "bg-zinc-700 border-gray-500 text-white placeholder-gray-300"
      : "border-gray-300 text-black"
  }`}
  value={weight}
  onChange={(e) => setWeight(e.target.value)}
/>

            <label className="block font-semibold mb-1">Build</label>
            <StyleDropdown layout={layout} />
          </div>
        </div>

        {/* Select Product Buttons */}
        <div>
          <label className="block font-semibold mb-2">Select Product</label>
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((item) => (
              <button
                key={item}
                onClick={() => setProductType(item)}
               className={`
  px-4 py-2 rounded  transition-colors duration-200 relative
  ${
    productType === item
      ? layout === 2
        ? "bg-zinc-700 border-white text-white"
        : "bg-white border-gray-800 text-gray-900"
      : layout === 2
        ? "bg-zinc-800  text-white hover:bg-zinc-700"
        : "bg-blue-50  text-gray-500 hover:bg-blue-200"
  }
`}
              >
                {item}
                {productType === item && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Image Preview Section */}
        {image && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Uploaded Image */}
            <div>
              <img
                src={image}
                alt="Large preview"
                className="w-full rounded shadow"
              />
            </div>

            {/* Product Overlay Preview */}
            <div className="relative w-full max-w-xs mx-auto">
              <img
                src={`/products/${productType}.png`}
                alt={productType}
                className="w-full object-contain"
              />
              <img
                src={image}
                alt="Small preview"
                className="absolute top-1/2 left-1/2 w-24 h-24 transform -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </div>
          </div>
        )}

        {/* Text Area */}
        <textarea
          className={`w-full border border-gray-300 rounded p-3 h-32 resize-none ${containerShadow}`}
          rows={3}
          maxLength={200}
          placeholder="Type text to print (max 3 lines)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
