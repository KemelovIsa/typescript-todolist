import React, { useEffect, useState } from "react";
import axios from "axios";

interface IData {
	_id: number;
	text: string;
	img: string;
}

const url = import.meta.env.VITE_ZAPROSSES_URL;

const Component: React.FC = () => {
	const [data, setData] = useState<IData[]>([]);
	const [value, setValue] = useState<string>("");
	const [img, setImg] = useState<string>("");
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, _] = useState<string>("");
	const [editImg, setEditImg] = useState<string>("");

	const handleAdd = async () => {
		if (value === "" || img === "") {
			console.log("Please write text");
		} else {
			try {
				const newData: IData = {
					_id:0,
					text: value,
					img: img,
				};

				const response = await axios.post<IData>(url, newData);
				setData([...data, response.data]);
			} catch (error) {
				console.error("Error", error);
			}
		}

		setImg("");
		setValue("");
	};

	const patchRequest = async (id: number) => {
		try {
			const updatedData = {
				text: editValue !== "" ? editValue : value,
				img: editImg !== "" ? editImg : img,
			};
			await axios.patch(`${url}/${id}`, updatedData);
			getRequest();
			setIsEditing(false);
		} catch (error) {
			console.error("Error", error);
		}
	};

	const deleteAll = async () => {
		try {
			await axios.delete(url);
			getRequest();
		} catch (error) {
			console.error("Error", error);
		}
	};

	const getRequest = async () => {
		try {
			const response = await axios.get<IData[]>(url);
			setData(response.data);
		} catch (error) {
			console.error("Error", error);
		}
	};

	const deleteRequest = async (id: number) => {
		try {
			await axios.delete(`${url}/${id}`);
			getRequest();
		} catch (error) {
			console.error("Error", error);
		}
	};

	useEffect(() => {
		getRequest();
	}, []);

	return (
		<div>
			<input
				type="text"
				value={img}
				onChange={(e) => setImg(e.target.value)}
				placeholder="Image URL"
			/>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Text"
			/>
			<button onClick={handleAdd}>Add</button>
			<button onClick={deleteAll}>Delete All</button>

			<div>
				{data.map((item) => (
					<div key={item._id}>
						<img src={item.img} alt="img" />
						<h1>{item.text}</h1>
						{isEditing ? (
							<>
								<input
									type="text"
									value={editImg}
									onChange={(e) => setEditImg(e.target.value)}
									placeholder="New Image URL"
								/>
								<button onClick={() => patchRequest(item._id)}>
									Save Edit
								</button>
							</>
						) : (
							<>
								<button onClick={() => deleteRequest(item._id)}>Delete</button>
								<button onClick={() => setIsEditing(true)}>Edit</button>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Component;
