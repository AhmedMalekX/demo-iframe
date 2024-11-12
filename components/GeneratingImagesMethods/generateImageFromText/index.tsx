/*
 * NextJS & ReactJS components
 * */

/*
 * Generate image using prompt components
 * */
import { Prompt } from "@/components/GeneratingImagesMethods/UI/Prompt";
import { Styles } from "@/components/GlobalUI/Styles";
import { NumberOfImages } from "@/components/GlobalUI/NumberOfImages";

export const GenerateImageFromText = () => {
  return (
    <div>
      {/*Prompt*/}
      <Prompt />

      <hr className="mt-6" />

      {/*Styles*/}
      <Styles />

      {/*Number of images*/}
      <NumberOfImages />

      <hr className="mt-6" />
    </div>
  );
};
