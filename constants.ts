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
        nextNodeId: 'react_truth'
      },
      {
        id: 'opt_partial',
        text: '“My car’s acting up. I don’t want to be on the road after dark.”',
        loadImpact: { paperReality: 10, coherence: -5 },
        blendBonus: 85,
        protector: ProtectorType.CAMOUFLAGE,
        description: 'Partial Truth. Maintenance Debt accruing.',
        nextNodeId: 'react_skeptic'
      },
      {
        id: 'opt_freeze',
        text: '...',
        loadImpact: { paperReality: -5, coherence: -5 },
        description: '[FREEZE RESPONSE] Stare at the hinge.',
        nextNodeId: 'react_freeze'
      },
      {
        id: 'opt_fawn',
        text: '“I’m sorry to bother you. I can leave right now. I didn’t mean to intrude.”',
        loadImpact: { coherence: -10, paperReality: 5 },
        protector: ProtectorType.CAMOUFLAGE,
        description: '[FAWN RESPONSE] Pre-emptive submission.',
        nextNodeId: 'react_fawn'
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

  // --- BRANCHING REACTIONS ---
  
  'react_truth': {
    id: 'react_truth',
    speaker: 'WOMAN',
    text: '(She looks at the wagon, then back to you. Her shoulders drop slightly.) At least you’re honest about it. Most folks give me a story about a breakdown.',
    options: [
       { id: 'cont_truth', text: '“I don’t have the energy for a story.”', loadImpact: {}, nextNodeId: 'offer_main', description: 'Maintain baseline.' }
    ]
  },
  'react_skeptic': {
    id: 'react_skeptic',
    speaker: 'WOMAN',
    text: '(She glances past you at the idling exhaust.) Sounds like it’s running fine to me. But I guess that’s your business.',
    options: [
       { id: 'cont_skeptic', text: '(Say nothing)', loadImpact: { coherence: -2 }, nextNodeId: 'offer_main', description: 'Accept suspicion.' }
    ]
  },
  'react_freeze': {
    id: 'react_freeze',
    speaker: 'WOMAN',
    text: 'Hey. Breathe. You aren’t the first person to freeze up on this porch. I’m not calling the cops.',
    options: [
       { id: 'cont_freeze', text: '(Nod)', loadImpact: { coherence: 5 }, nextNodeId: 'offer_main', description: 'Regulate nervous system.' }
    ]
  },
  'react_fawn': {
    id: 'react_fawn',
    speaker: 'WOMAN',
    text: 'Stop that. You aren’t in trouble. You just look cold.',
    options: [
       { id: 'cont_fawn', text: '“Okay.”', loadImpact: { coherence: -5 }, nextNodeId: 'offer_main', description: 'Correction received.' }
    ]
  },

  // --- THE OFFER HUB ---

  'offer_main': {
    id: 'offer_main',
    speaker: 'WOMAN',
    text: 'You can park out there if you want. But you should come inside. It’s dropping to single digits tonight.',
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
        nextNodeId: 'resolution_immediate' // Rewards honesty with a quick resolution
      },
      {
        id: 'field_deflect',
        text: '“I don’t want to be any trouble.”',
        loadImpact: { coherence: -5 },
        protector: ProtectorType.CAMOUFLAGE,
        description: 'Field Only (Deflect). Boundary ambiguous.',
        nextNodeId: 'react_deflect'
      },
      {
        id: 'opt_scan',
        text: '(Scan the hallway behind her for threat vectors)',
        loadImpact: { sleepDebt: 5 },
        protector: ProtectorType.GABLE,
        riskDelta: 20,
        description: 'Threat Assessment. No visible hostiles.',
        nextNodeId: 'react_scan'
      },
      {
        id: 'opt_barter',
        text: '“I don’t have any money for a room.”',
        loadImpact: { paperReality: 5 },
        description: 'Establish Transactional Frame.',
        nextNodeId: 'react_barter'
      }
    ]
  },

  // --- SECONDARY REACTIONS ---

  'react_scan': {
    id: 'react_scan',
    speaker: 'WOMAN',
    text: '(She notices your eyes tracking the hallway.) It’s just me and the heater. You want in or not?',
    options: [
        { id: 'scan_rec', text: '“Not. Just the field.”', loadImpact: { coherence: 5 }, nextNodeId: 'clarification_generic', description: 'Confirm boundary.' }
    ]
  },
  'react_barter': {
    id: 'react_barter',
    speaker: 'WOMAN',
    text: 'Put your cash away. I don’t run a motel. I just don’t like seeing people freeze.',
    options: [
        { id: 'barter_ack', text: '“I can’t owe you anything.”', loadImpact: { paperReality: 5 }, nextNodeId: 'clarification_generic', description: 'State terms.' }
    ]
  },
  'react_deflect': {
    id: 'react_deflect',
    speaker: 'WOMAN',
    text: 'You aren’t trouble. Don’t be a martyr. It’s too cold for that.',
    options: [
        { id: 'deflect_ack', text: '“It’s not safe for me inside.”', loadImpact: { coherence: 10 }, nextNodeId: 'clarification_generic', description: 'Pivot to truth.' },
        { id: 'deflect_weak', text: '“I’ll be fine.”', loadImpact: { coherence: -5 }, nextNodeId: 'clarification_generic', description: 'Weak assertion.' }
    ]
  },

  // --- FINAL CLARIFICATION ---

  'clarification_generic': {
    id: 'clarification_generic',
    speaker: 'WOMAN',
    text: 'Well. Choice is yours. If you change your mind, door is unlocked.',
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
        text: '“I’ll be okay. I’ve done worse.”',
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
        id: 'opt_dogmatic',
        text: '“I don’t go indoors. That’s the rule.”',
        loadImpact: { coherence: 10, paperReality: -5 },
        protector: ProtectorType.GATEKEEPER,
        description: 'Reinforce Exile Protocol.',
        nextNodeId: 'resolution_field'
      }
    ]
  },

  // --- SYSTEM FAILURES & RESOLUTIONS ---

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
            nextNodeId: 'react_scan' // Loops back to her noticing your weird behavior
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
  'resolution_immediate': {
    id: 'resolution_immediate',
    speaker: 'WOMAN',
    text: '(She studies your face. No pity, just calculation.) Alright. Field’s yours. Don’t leave trash.',
    isEndNode: true,
    options: []
  },
  'resolution_field': {
    id: 'resolution_field',
    speaker: 'WOMAN',
    text: 'Alright. Field’s yours. Don’t leave trash. If you change your mind, knock.',
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