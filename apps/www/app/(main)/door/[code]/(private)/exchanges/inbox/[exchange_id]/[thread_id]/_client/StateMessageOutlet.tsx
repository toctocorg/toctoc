//

import type { Params } from ":pipes/thread_by_id";
import { TRPC_React } from ":trpc/client";
import type { RouterOutput } from "@1.infra/trpc";
import { Deal_Status_Schema } from "@1.modules/exchange.domain";
import { useExchange } from "@1.modules/exchange.ui/context";
import { Denied } from "@1.ui/react/icons";
import type { QueryObserverSuccessResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

//

export function StateMessageOutlet({ thread_id }: Params) {
  const inbox_query =
    TRPC_React.exchanges.me.inbox.by_thread_id.useQuery(thread_id);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="my-2"
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        initial={{ y: 10, opacity: 0 }}
        key={inbox_query.data?.deal.status ?? inbox_query.status}
      >
        {match(inbox_query)
          .with({ status: "loading" }, () => <>Loading…</>)
          .with({ status: "error" }, () => <>Error</>)
          .with({ status: "success" }, (query) => (
            <StateMessage inbox_query_info={query} />
          ))
          .exhaustive()}
      </motion.div>
    </AnimatePresence>
  );
}
type InboxQuerySuccessResult = QueryObserverSuccessResult<
  RouterOutput["exchanges"]["me"]["inbox"]["by_thread_id"]
>;
function StateMessage({
  inbox_query_info,
}: {
  inbox_query_info: InboxQuerySuccessResult;
}) {
  const {
    owner: {
      profile: { id: owner_profile_id },
    },
    deals,
    places,
  } = useExchange();
  const { data: session } = useSession();
  if (!session) return null;
  const is_organizer = owner_profile_id === session.profile.id;
  const is_complet = deals.length === places;
  return match({ status: inbox_query_info.data.deal.status, is_complet })
    .with(
      { status: Deal_Status_Schema.Enum.APPROVED, is_complet: true },
      () => null,
    )
    .with(
      { status: Deal_Status_Schema.Enum.APPROVED, is_complet: false },
      () => (
        <WaitingForOtherParticipantApproval
          participant_count={places - deals.length}
        />
      ),
    )
    .with({ status: Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER }, () => (
      <WaitingForParticipantApproval is_organizer={is_organizer} />
    ))
    .with({ status: Deal_Status_Schema.Enum.DENIED }, () => <DeniedDeal />)
    .with({ status: Deal_Status_Schema.Enum.IDLE }, () => (
      <WaitingForOrganizerApproval is_organizer={is_organizer} />
    ))
    .exhaustive();
}

function DeniedDeal() {
  const { base, icon } = state_message_classes();
  return (
    <p className={base()}>
      <Denied className={icon()} />
      Un accord n'a pas été trouvé.
    </p>
  );
}

function WaitingForParticipantApproval({
  is_organizer,
}: {
  is_organizer: boolean;
}) {
  return (
    <WaitingForApproval>
      {is_organizer ? (
        <span>En attente de la confirmation du participant.</span>
      ) : (
        <span className="font-semibold">
          En attente d'une confirmation de votre part.
        </span>
      )}
    </WaitingForApproval>
  );
}

function WaitingForOtherParticipantApproval({
  participant_count,
}: {
  participant_count: number;
}) {
  const plurial = participant_count > 1 ? "s" : "";
  return (
    <WaitingForApproval>
      En attente de la confirmation de {participant_count} autre
      {plurial} participant{plurial}.
    </WaitingForApproval>
  );
}

function WaitingForOrganizerApproval({
  is_organizer,
}: {
  is_organizer: boolean;
}) {
  return (
    <WaitingForApproval>
      {is_organizer ? (
        <span className="font-semibold">
          En attente d'une confirmation de votre part.
        </span>
      ) : (
        <span>En attente de confirmation de la part de l'organisation.</span>
      )}
    </WaitingForApproval>
  );
}

function WaitingForApproval({ children }: PropsWithChildren) {
  const { base, icon } = state_message_classes();
  return (
    <p className={base()}>
      <Image
        alt="hourglass"
        className={icon()}
        height={12}
        src="/hourglass.svg"
        width={8}
      />
      {children}
    </p>
  );
}
const state_message_classes = tv({
  base: "text-center text-xs text-Dove_Gray",
  slots: {
    icon: "mr-2 inline-block size-3",
  },
});
