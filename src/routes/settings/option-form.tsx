// import { OptionFormData } from "./create-line-item";

// type OptionFormProps = {
//   option: OptionFormData;
//   update
// };

// export default function OptionForm({ option }: OptionFormProps) {
//     function handleChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//       }

//   return (
//     <div>
//       <h1>{option.tier.name}</h1>
//       <label htmlFor="marginDecimal" className="block mb-1">
//         Price Adjustment
//       </label>
//       <input
//         type="number"
//         id="priceAdjustmentDecimal"
//         name="priceAdjustmentDecimal"
//         value={option.priceAdjustmentDecimal}
//         onChange={(e) => }
//         step="0.01"
//         max={"0.99"}
//         min={"0"}
//         required
//         className="border border-gray-300 p-1 rounded w-full"
//       />
//     </div>
//   );
// }
