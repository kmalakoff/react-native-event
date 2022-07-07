import { TestInstance } from 'react-test-renderer';
type Visitor = (element: TestInstance) => void;

export default function visit(element: TestInstance, fn: Visitor) {
  fn(element);
  element.children?.forEach((x) => visit(x, fn));
}
