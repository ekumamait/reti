import { useRouteError } from "react-router-dom";
import {Result, Button} from 'antd'

export default function ErrorPage() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
    const error:{statusText:string, message: string} = useRouteError();
  console.error(error);

  return (
      <Result
          status="500"
          title="500"
          subTitle="Sorry, an unexpected error has occurred."
          extra={<Button href="/"  type="primary">Back Home</Button>}
      />
  );
}