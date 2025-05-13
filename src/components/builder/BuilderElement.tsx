
import { ElementWrapper } from "./elements/ElementWrapper";

export interface BuilderElementProps {
  element: any;
  index: number;
  selected: boolean;
  isPreviewMode: boolean;
  canUseAnimations?: boolean;
  canUseEnterpriseAnimations?: boolean;
}

export { ElementWrapper };
export default ElementWrapper;
