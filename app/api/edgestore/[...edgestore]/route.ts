import { auth } from "@/auth";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";

type Context = {
  id: string;
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const session = await auth();
  return {
    id: session?.user.id as string,
  };
}

const es = initEdgeStore.context<Context>().create();
/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  protectedFiles: es
    .fileBucket()
    .path(({ ctx }) => [{ owner: ctx.id }])
    .accessControl({
      OR: [
        {
          id: { path: "owner" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
  // logLevel: "debug",
});

export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
