import axios from "./AxiosInstance";

export const useMypageApi = () => {
    const mypageMain = async () => {
        return await axios.get("/mypage/main");
    };

    const mypageMyPickMovie = async () => {
        return await axios.get("/mypage/myPickMovie");
    };
    const mypageReview = async () => {
        return await axios.get("/mypage/review");
    };
    const mypageShortReview = async () => {
        return await axios.get("/mypage/shortReview");
    };

    const userInfoGet = async () => {
        return await axios.get("/user");
    };

    const getFollower = async (targetId: number) => {
        return await axios.get(`/follow/followers/${targetId}`);
    };

    const getFollowing = async (targetId: number) => {
        return await axios.get(`/follow/following/${targetId}`);
    };

    const updateProfile = async (formData: FormData) => {
        try {
            const response = await axios.post("/mypage/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("업데이트 성공:", response.data);
            return response.data;
        } catch (error) {
            console.error("업데이트 실패:", error);
            throw error;
        }
    };

    const getGenre = async () => {
        return await axios.get("/mypage/userGenres");
    };

    const updateGenre = async (genreIds: number[]) => {
        return await axios.post("/mypage/userGenres", {
            genreIds: genreIds,
        });
    };

    return {
        mypageMain,
        mypageMyPickMovie,
        mypageReview,
        mypageShortReview,
        userInfoGet,
        getFollower,
        getFollowing,
        updateProfile,
        getGenre,
        updateGenre,
    };
};
export default useMypageApi;
