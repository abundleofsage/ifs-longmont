import { DialogueOption, GamePhase, NarrativeNode, ProtectorType } from './types';

export const INITIAL_RESOURCES = {
  coherence: 65,
  coldLoad: 40,
  sleepDebt: 72,
  paperReality: 15,
  fleshReality: 45,
};

// The Narrative Script for the Wheat Field Negotiation
export const NARRATIVE_NODES: Record<string, NarrativeNode> = {
  'start': {
    id: 'start',
    speaker: 'SYSTEM',
    text: 'Sequence loaded: LM-02-WHEAT. Location: Unlabeled Farmhouse. Ambient Temp: 18°F. Status: Approach initiated.',
    options: [
      {
        id: 'approach',
        text: 'Knock on the door.',
        loadImpact: { coldLoad: 5 },
        protector: ProtectorType.GATEKEEPER,
        nextNodeId: 'door_open',
        riskDelta: 15,
        description: 'Initiate contact.'
      }
    ]
  },
  'door_open': {
    id: 'door_open',
    speaker: 'WOMAN (50s)',
    text: 'You lost?',
    options: [
      {
        id: 'opt_truth',
        text: '“I’m living out of my car for a bit. I’m looking for somewhere quiet to park tonight.”',
        loadImpact: { coherence: 15, paperReality: -10 },
        riskDelta: 75,
        protector: ProtectorType.GABLE,
        description: 'Direct Truth. Honest Exposure.',
        nextNodeId: 'response_offer'
      },
      {
        id: 'opt_partial',
        text: '“My car’s acting up. I don’t want to be on the road after dark.”',
        loadImpact: { paperReality: 10, coherence: -5 },
        blendBonus: 85,
        protector: ProtectorType.CAMOUFLAGE,
        description: 'Partial Truth. Maintenance Debt accruing.',
        nextNodeId: 'response_offer'
      },
      {
        id: 'opt_freeze',
        text: '...',
        loadImpact: { paperReality: -5, coherence: -5 },
        description: '[FREEZE RESPONSE] Stare at the hinge.',
        nextNodeId: 'response_offer'
      },
      {
        id: 'opt_fawn',
        text: '“I’m sorry to bother you. I can leave right now. I didn’t mean to intrude.”',
        loadImpact: { coherence: -10, paperReality: 5 },
        protector: ProtectorType.CAMOUFLAGE,
        description: '[FAWN RESPONSE] Pre-emptive submission.',
        nextNodeId: 'door_open_retry' // Brief loop or jump to offer depending on design, mapping to offer for flow
      },
      {
        id: 'opt_exit',
        text: '“Sorry—wrong house.”',
        loadImpact: { coldLoad: 15 },
        protector: ProtectorType.GATEKEEPER,
        description: 'Abort. Relocate to DMZ.',
        nextNodeId: 'abort'
      }
    ]
  },
  'door_open_retry': { // Handling the Fawn response flow
    id: 'door_open_retry',
    speaker: 'WOMAN',
    text: 'Easy. You aren\'t intruding. You just look cold.',
    options: [
        {
            id: 'retry_truth',
            text: '“I just need a place to park.”',
            loadImpact: { coherence: 5 },
            nextNodeId: 'response_offer'
        }
    ]
  },
  'response_offer': {
    id: 'response_offer',
    speaker: 'WOMAN',
    text: 'You can park out there if you want. But you should come inside. It’s cold.',
    exileTrigger: 'ZERO-INTERVENTION BASELINE: No rescue is coming.',
    options: [
      {
        id: 'accept_house',
        text: '“Thank you. I’d appreciate that.”',
        loadImpact: { coherence: -20 },
        riskDelta: 99,
        description: 'Attempt Entry. [SYSTEM BLOCK]',
        nextNodeId: 'intervention_failure_1'
      },
      {
        id: 'field_truth',
        text: '“The field would be perfect. I don’t stay inside places anymore.”',
        loadImpact: { coherence: 10, coldLoad: 5 },
        protector: ProtectorType.GABLE,
        description: 'Field Only (Truthful). Trust recalibrated.',
        nextNodeId: 'clarification'
      },
      {
        id: 'field_deflect',
        text: '“I don’t want to be any trouble.”',
        loadImpact: { coherence: -5 },
        protector: ProtectorType.CAMOUFLAGE,
        description: 'Field Only (Deflect). Boundary ambiguous.',
        nextNodeId: 'clarification'
      },
      {
        id: 'opt_scan',
        text: '(Scan the hallway behind her for threat vectors)',
        loadImpact: { sleepDebt: 5 },
        protector: ProtectorType.GABLE,
        riskDelta: 20,
        description: 'Threat Assessment. No visible hostiles.',
        nextNodeId: 'clarification'
      },
      {
        id: 'opt_barter',
        text: '“I don’t have any money for a room.”',
        loadImpact: { paperReality: 5 },
        description: 'Establish Transactional Frame.',
        nextNodeId: 'clarification'
      }
    ]
  },
  'intervention_failure_1': {
    id: 'intervention_failure_1',
    speaker: 'BODY_OS',
    text: 'CRITICAL FAILURE. Muscle group [LEGS] unresponsive. Throat constriction detected. The Zero-Intervention Baseline rejects the input "ENTER_HOUSE". Safety is a trap.',
    options: [
        {
            id: 'recoil',
            text: '(Stumble back)',
            loadImpact: { coherence: -10 },
            description: 'Physical rejection of offer.',
            nextNodeId: 'clarification'
        }
    ]
  },
  'clarification': {
    id: 'clarification',
    speaker: 'WOMAN',
    text: 'I don’t mind helping. I just don’t want you freezing out there.',
    options: [
      {
        id: 'state_risk',
        text: '“If I stay inside once, it won’t be just once. And I can’t control who else gets invited in later.”',
        loadImpact: { coherence: 25, coldLoad: 5 },
        riskDelta: 60,
        protector: ProtectorType.GABLE,
        description: 'State the Risk. Unlocks: Ethical Coherence.',
        nextNodeId: 'resolution_field'
      },
      {
        id: 'soft_refusal',
        text: '“I’ll be fine. I’ve done worse.”',
        loadImpact: { coldLoad: 5 },
        protector: ProtectorType.CAMOUFLAGE,
        description: 'Soft Refusal. Motive unreadable.',
        nextNodeId: 'resolution_field'
      },
      {
        id: 'yield',
        text: '“Just for tonight, then.”',
        loadImpact: { coherence: -15 },
        description: 'Yield. [SYSTEM BLOCK]',
        nextNodeId: 'intervention_failure_2'
      },
      {
        id: 'opt_dissociate',
        text: '(Watch the heat shimmer escaping from her open door)',
        loadImpact: { coldLoad: -5, coherence: -5 },
        description: '[DISSOCIATE] Tuning out the signal.',
        nextNodeId: 'resolution_field'
      },
      {
        id: 'opt_dogmatic',
        text: '“I don’t go indoors. That’s the rule.”',
        loadImpact: { coherence: 10, paperReality: -5 },
        protector: ProtectorType.GATEKEEPER,
        description: 'Reinforce Exile Protocol.',
        nextNodeId: 'resolution_field'
      }
    ]
  },
  'intervention_failure_2': {
    id: 'intervention_failure_2',
    speaker: 'BODY_OS',
    text: 'SYSTEM OVERRIDE. Nausea spike. Your feet step backward automatically. The body knows what happens in houses. You cannot go in.',
    options: [
        {
            id: 'forced_retreat',
            text: '“Actually... never mind. I can’t.”',
            loadImpact: { coherence: -5 },
            description: 'Accept constraint.',
            nextNodeId: 'resolution_field'
        }
    ]
  },
  'resolution_field': {
    id: 'resolution_field',
    speaker: 'WOMAN',
    text: 'Alright. Field’s yours. Don’t leave trash. If you change your mind, knock.',
    isEndNode: true,
    options: []
  },
  'resolution_house': {
    id: 'resolution_house',
    speaker: 'WOMAN',
    text: 'Door’s open. Wipe your feet.',
    isEndNode: true,
    options: []
  },
  'abort': {
    id: 'abort',
    speaker: 'SYSTEM',
    text: 'Relocation Initiated. Opportunity Node Missed. Cold Load Critical.',
    isEndNode: true,
    options: []
  }
};
