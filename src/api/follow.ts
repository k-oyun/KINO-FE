import axios from "./axiosInstance";

const useFollowApi = () => {
  const getIsFollowed = (targetId: number) => {
    return axios.get(`/follow/status/${targetId}`);
  };

  const getFollowers = (targetId: number) => {
    return axios.get(`/follow/followers/${targetId}`);
  };

  const getFollowing = (targetId: number) => {
    return axios.get(`/follow/following/${targetId}`);
  };

  const postFollow = (targetId: number) => {
    console.log(`팔로우 요청: ${targetId}`);
    return axios.post(`/follow/${targetId}`);
  };

  const deleteFollow = (targetId: number) => {
    return axios.delete(`/follow/${targetId}`);
  };

  return {
    getIsFollowed,
    getFollowers,
    getFollowing,
    postFollow,
    deleteFollow,
  };
};

export default useFollowApi;
