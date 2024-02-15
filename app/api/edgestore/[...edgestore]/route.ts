import { authOptions } from "@/lib/auth";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { getServerSession } from "next-auth";

type Context = {
  organizationId: string;
};

async function createContext({ req }: CreateContextOptions): Promise<Context> {
  const session = await getServerSession(authOptions);

  return {
    organizationId: session?.user.organizationId as string,
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
    .path(({ ctx }) => [{ owner: ctx.organizationId }])
    .accessControl({
      OR: [
        {
          organizationId: { path: "owner" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
