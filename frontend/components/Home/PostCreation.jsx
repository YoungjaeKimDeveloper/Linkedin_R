// External
import React, { useState } from "react";
import { Loader, Send, Image } from "lucide-react";
import { toast } from "react-hot-toast";
// Internal
import userProfile from "../../public/avatar.png";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../src/lib/axiosInstance.js";
const PostCreation = ({ authUser }) => {
  // Track the info
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  // PostMutation
  const { mutate: postCreatMutation, isPending: loadingMutation } = useMutation(
    {
      mutationFn: async (data) => {
        await axiosInstance.post("/posts/create", data);
      },
      onSuccess: () => {
        toast.success("Posted Successfully");
        resetForm();
      },
      onError: (error) => {
        console.error(
          `ERROR IN [postCreatMutation] ${error?.response?.data?.message}`
        );
        toast.error(
          `ERROR IN [postCreatMutation] ${error?.response?.data?.message}`
        );
      },
    }
  );
  // handleImage
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    // Preview -> Base64 인코딩을의미함
    if (file) {
      readFileAsURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };
  // Base 64로 Priview 할수있게
  const readFileAsURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // 미리 행동 규정해주기

      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      // 들어온 파일 읽어주기
      reader.readAsDataURL(file);
    });
  };
  // 백엔드로 전송해주기
  const handlePostCreation = async (e) => {
    e.preventDefault();
    try {
      const postData = { content };
      if (image) {
        // URL로 읽을수있게 해주기
        postData.image = await readFileAsURL(image);
      }
      postCreatMutation(postData);
    } catch (error) {
      console.error("ERROR IN [handlePostCreation]", error?.message);
    }
  };
  // 폼 초기화 해주기
  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview("");
  };
  // Testing
  console.log("IMAGE", image);
  console.log("IMAGE PREVIEW", imagePreview);
  return (
    <div className="bg-gray-200 max-w-[700px] h-[200px] rounded-2xl">
      <form onSubmit={handlePostCreation}>
        <div className="p-4">
          <div className="flex justify-between gap-x-2 items-start">
            <img
              src={authUser.profilePicture || userProfile}
              alt="user-Profile"
              className="size-20 object-cover rounded-full mt-2"
            />
            <textarea
              className="bg-gray-300 w-full h-[120px] rounded-2xl !resize-none !font-bold px-2"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Say Something..."
              value={content}
              required
              maxLength={150}
            />
          </div>
          <div className="flex justify-between mt-4 relative">
            <label htmlFor="image" className="cursor-pointer">
              <Image size={40} />
            </label>
            <input
              type="file"
              className="hidden"
              id="image"
              onChange={(e) => handleImage(e)}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected_image"
                className="size-30 absolute right-[50%] rounded-2xl "
              />
            )}
            <button
              className="bg-blue-400 p-2 rounded-xl text-white font-bold cursor-pointer"
              type="submit"
              disabled={loadingMutation}
            >
              {loadingMutation ? <Loader className="animate-spin" /> : <Send />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostCreation;
