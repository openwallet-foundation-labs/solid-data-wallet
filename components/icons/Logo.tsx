//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import React from "react";
import Svg, {
  G,
  Text,
  Defs,
  Circle,
  Mask,
  Use,
  Polygon,
  TSpan,
} from "react-native-svg";

const Logo: React.FC = () => (
  <Svg width="302px" height="239px" viewBox="0 0 302 239">
    <Defs>
      <Circle id="path-1" cx="45" cy="45" r="45"></Circle>
    </Defs>
    <G id="Wallet-MVP" stroke="none" strokeWidth="1" fill="none">
      <G id="Wallet-MVP-Login" transform="translate(-221, -510)">
        <G id="Logo" transform="translate(221.5, 510)">
          <Text
            id="Future-Co-Wallet"
            fontFamily="ReadexPro-Regular_Bold, Readex Pro"
            fontSize="50.4"
            fontWeight="700"
            fill="#1C2033"
          >
            <TSpan x="0.0056" y="163">
              {" "}
              FUTURE CO
            </TSpan>
            <TSpan x="45.29" y="226">
              WALLET
            </TSpan>
          </Text>
          <G transform="translate(105.5, 0)">
            <Mask id="mask-2" fill="white">
              <Use xlinkHref="#path-1"></Use>
            </Mask>
            <Use id="Mask" fill="#1C2033" xlinkHref="#path-1"></Use>
            <Polygon
              id="Star"
              fill="#FFFFFF"
              mask="url(#mask-2)"
              points="46.4516129 74.0322581 17.4415666 89.283742 22.9819924 56.9805807 -0.487628062 34.1033548 31.9465897 29.3903871 46.4516129 0 60.9566361 29.3903871 93.3908539 34.1033548 69.9212334 56.9805807 75.4616592 89.283742"
            ></Polygon>
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default Logo;
