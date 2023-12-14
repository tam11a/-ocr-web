import React from "react";
import { Upload } from "antd";
import { TbDragDrop } from "react-icons/tb";
const { Dragger } = Upload;
import type { UploadProps } from "antd";
import Tesseract from "tesseract.js";

const DragZone: React.FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [data, setData] = React.useState<any[]>([]);
	const props: UploadProps = {
		name: "file",
		multiple: true,
		customRequest: async (info) => {
			const { file } = info;
			console.log(info);
			Tesseract.recognize(file as File, "eng+ben").then(function (result) {
				console.log(result?.data);
				setData((data) => [...data, result?.data]);
			});
			return true;
		},
		// action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
		// onChange: async (info) => {
		// 	const { file } = info;
		// Tesseract.recognize(file as File, "eng+ben").then(function (result) {
		// 	console.log(result);
		// });
		// console.log(await convert2png(file.originFileObj));
		// },
		onDrop() {
			setData([]);
		},
	};
	return (
		<>
			<Dragger {...props}>
				<p className="ant-upload-drag-icon text-6xl text-slate-500 flex flex-row items-center justify-center">
					<TbDragDrop />
				</p>
				<p className="ant-upload-text">
					Click or drag file to this area to upload
				</p>
				<p className="ant-upload-hint">
					Support for a single or bulk upload. Strictly prohibited from
					uploading company data or other banned files.
				</p>
			</Dragger>
			{data?.map((item, index) => (
				<div
					key={index}
					dangerouslySetInnerHTML={{
						__html: item?.hocr || "",
					}}
				/>
			))}
		</>
	);
};

export default DragZone;
