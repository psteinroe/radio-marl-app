import { forwardRef } from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export const Playing = forwardRef<Svg, SvgProps>((props, ref) => (
  <Svg ref={ref} viewBox="0 0 12 12" {...props}>
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.0588379 11.2509L0.0279807 5.37436L2.28831 5.36507L2.31917 11.2416L0.0588379 11.2509ZM4.52137 11.1013L4.47775 2.79483L6.73808 2.78554L6.7817 11.0921L4.52137 11.1013ZM9.005 0.00933195L9.06305 11.064L11.3234 11.0547L11.2653 3.98001e-05L9.005 0.00933195Z"
    />
  </Svg>
));
