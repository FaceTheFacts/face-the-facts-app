import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export interface ProfilePicturePlaceholderProps {
  size?: number;
}

const ProfilePicturePlaceholder = ({
  size = 76,
}: ProfilePicturePlaceholderProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76">
      <Circle cx={38} cy={38} r={30} fill="white" />
      <Path
        d="M38,0c-21.078,0 -38,17.07 -38,38c0,21.078 16.922,38 38,38c20.93,0 38,-16.922 38,-38c0,-20.93 -17.07,-38 -38,-38Zm0,19c5.789,0 10.687,4.898 10.687,10.687c0,5.938 -4.898,10.688 -10.687,10.688c-5.937,0 -10.687,-4.75 -10.687,-10.688c-0,-5.789 4.75,-10.687 10.687,-10.687Zm0,47.5c-7.867,0 -14.992,-3.117 -20.187,-8.313c2.374,-6.234 8.312,-10.687 15.437,-10.687l9.5,0c6.977,0 12.914,4.453 15.289,10.687c-5.195,5.196 -12.32,8.313 -20.039,8.313Z"
        fill="#181924"
      />
    </Svg>
  );
};

export default ProfilePicturePlaceholder;
