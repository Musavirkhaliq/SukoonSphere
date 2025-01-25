import { useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const FormRow = ({ type, name, labelText, value, disable }) => {
    const [Type, setType] = useState(type);
    const showPassword = () => {
        {
            Type === "password"
                ? setType((setType) => "text")
                : setType((setType) => "password");
        }
    };

    return (
        <div >
            <label htmlFor={name} className="formLabel">
                {labelText}
            </label>
            <input
                style={{ cursor: disable && "not-allowed" }}
                type={labelText === "password" ? Type : type}
                id={name}
                name={name}
                className="formInput"
                defaultValue={value || ""}
                required
                readOnly={disable}
            />
            {type === "password" && <span className="passwordIcon" onClick={showPassword}>{Type === "password" ? <FaEyeSlash /> : <FaRegEye />}</span>}
        </div >
    );
};
export const FormTextareaRow = ({ name, labelText, value = "" }) => {
    return (
        <div className={"formRow rowSpan"}>
            <label htmlFor={name} className="formLabel">
                {labelText}
            </label>
            <textarea
                id={name}
                name={name}
                defaultValue={value}
                className="formInput"
                rows={4}
                required
            />
        </div>
    );
};
export const FormImageRow = ({ name, labelText }) => {
    return (
        <div className="formRow ">
            <label htmlFor={name} className="formLabel">
                {labelText}
            </label>
            <input
                type="file"
                id={name}
                name={name}
                className="fileInput"
                accept="image/*"
            />
        </div>
    );
};

export const FormSelectRow = ({ name, labelText, list, value = "" }) => {
    return (
        <select
            id={name}
            name={name}
            className="formInput"
            defaultValue={value}
            required
        >
            {list.map((item) => {
                return (
                    <option key={item} value={item}>
                        {item}
                    </option>
                );
            })}
        </select>
    );
};
export const InputComponent = ({ type, name, placeholder, }) => {

    return <input type={type} name={name} placeholder={placeholder} className="input input-bordered w-full bg-gray-100 text-[var(--black-color)]" />
}
export default FormRow;
