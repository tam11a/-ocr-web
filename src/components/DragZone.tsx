import React from "react";
import { Collapse, Skeleton, Tag, Upload } from "antd";
import { TbDragDrop } from "react-icons/tb";
const { Dragger } = Upload;
import type { CollapseProps, UploadProps } from "antd";
import Tesseract from "tesseract.js";

const DragZone: React.FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [data, setData] = React.useState<CollapseProps["items"]>([]);
	const [totalLoading, setTotalLoading] = React.useState(0);

	const props: UploadProps = {
		name: "file",
		multiple: true,
		showUploadList: false,
		beforeUpload: (file) => {
			setTotalLoading((totalLoading) => totalLoading + 1);
			Tesseract.recognize(file as File, "eng+ben").then(function (result) {
				setData((data) => [
					...(data ? data : []),
					{
						key: file.uid,
						label: (
							<>
								{file.name}{" "}
								<Tag color={result?.data?.confidence > 90 ? "green" : "error"}>
									{result?.data?.confidence}%
								</Tag>
							</>
						),
						children: (
							<div
								dangerouslySetInnerHTML={{
									__html: result?.data?.hocr || "",
								}}
							/>
						),
					},
				]);
				setTotalLoading((totalLoading) => totalLoading - 1);
			});
			return false;
		},
	};
	return (
		<>
			<div className="max-w-xl my-5 mx-auto w-[90vw]">
				<Dragger {...props}>
					<p className="ant-upload-drag-icon text-6xl text-slate-500 flex flex-row items-center justify-center pt-3">
						<TbDragDrop />
					</p>
					<p className="ant-upload-text font-bold">
						Click or drag file to this area to upload
					</p>
					<p className="ant-upload-hint font-semibold text-slate-700 max-w-sm mx-auto">
						Support for a single or bulk upload. Strictly prohibited from
						uploading company data or other banned files.
					</p>
				</Dragger>
			</div>
			{!!data?.length || totalLoading > 0 ? (
				<div className="max-w-[95vw] mx-auto">
					{!!data?.length && <Collapse items={data} />}
					{totalLoading > 0 &&
						Array.from({ length: totalLoading }, (_, index) => (
							<Skeleton
								key={index}
								active
								className="my-3"
							/>
						))}
				</div>
			) : (
				<></>
			)}
		</>
	);
};

export default DragZone;
