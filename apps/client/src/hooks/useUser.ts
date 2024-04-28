import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/user";

export const useUser = () => {
  const value = useRecoilValue(userAtom);
  return value;
};
