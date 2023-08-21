//

import type {
  DefaultContextExtends,
  DefaultStateExtends,
  ParameterizedContext,
} from "koa";

//

export interface State extends DefaultStateExtends {
  user?: {
    id: string;
  };

  route: {
    info: {
      apiName: string;
    };
    handler: string;
  };
}

export interface Context extends DefaultContextExtends {
  params?: {
    id: string;
  };
  query: {
    filters?: Record<string, unknown> | Object;
    populate?: Record<string, unknown> | string | Object;
  };
}

export interface ResponseBody {
  data: Record<string, unknown>;
}

export interface StrapiContext
  extends ParameterizedContext<State, Context, ResponseBody> {}
