import {SafeProposal} from "./safeProposal"
import {StrategyProposal} from "./strategyProposal"

export type Proposal = SafeProposal | StrategyProposal

export type ExtendedProposal = Proposal & {proposalType: "admin" | "strategy"; proposalId?: string}
