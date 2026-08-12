export const CATEGORY_DETAILS = {
  communication: {
    label: 'Communication',
    shortLabel: 'Communication',
    icon: '“ ”'
  },
  grossMotor: {
    label: 'Gross motor',
    shortLabel: 'Gross motor',
    icon: '↗'
  },
  fineMotor: {
    label: 'Fine motor',
    shortLabel: 'Fine motor',
    icon: '✋'
  },
  problemSolving: {
    label: 'Problem solving',
    shortLabel: 'Problem solving',
    icon: '✦'
  },
  personalSocial: {
    label: 'Personal & social',
    shortLabel: 'Personal & social',
    icon: '♥'
  }
};

export const DEVELOPMENT_SOURCES = [
  {
    label: 'CDC developmental milestones',
    url: 'https://www.cdc.gov/act-early/milestones/index.html'
  },
  {
    label: 'American Academy of Pediatrics: surveillance and screening',
    url: 'https://www.aap.org/en/patient-care/developmental-surveillance-and-screening-patient-care/'
  }
];

export const AGE_SETS = [
  {
    months: 2,
    label: '2-month check-in',
    intro: 'Choose a calm, awake time. Young babies tire quickly, so pause whenever the baby needs feeding, sleep or comfort.',
    questions: [
      q('personalSocial', 'When settled and awake, does the baby spend a moment looking at a familiar face nearby?', 'Hold your face about 20–30 cm away and speak softly. Give the baby time to focus.'),
      q('personalSocial', 'Does a familiar voice, gentle touch or being picked up usually help the baby become calmer?', 'Think about several everyday moments rather than one unusually difficult day.'),
      q('personalSocial', 'When someone smiles or talks warmly, does the baby sometimes respond with a smile or a brighter expression?', 'Try this when the baby is comfortable, alert and not hungry.'),
      q('communication', 'Does the baby make small sounds other than crying, such as soft vowel sounds, grunts or coos?', 'Listen during face-to-face time, feeding or nappy changes.'),
      q('communication', 'Does the baby change their expression or movement when hearing a familiar voice?', 'The response may be subtle: becoming still, moving more or turning the eyes.'),
      q('communication', 'Does the baby react to a sudden nearby sound by blinking, startling or pausing briefly?', 'Use an ordinary household sound. Never make a very loud sound close to the baby’s ears.'),
      q('problemSolving', 'Does the baby watch a person who moves slowly across their field of view?', 'Move slowly from one side to the other while staying within the baby’s comfortable viewing distance.'),
      q('problemSolving', 'Can the baby keep looking at a face or bold toy for several seconds?', 'A simple high-contrast picture or uncluttered toy works best.'),
      q('problemSolving', 'Does the baby notice when a new light, sound or object appears nearby?', 'Look for widened eyes, stillness, movement or a change in facial expression.'),
      q('grossMotor', 'During supervised tummy time, can the baby lift or turn their head for a short moment?', 'Only try tummy time while the baby is awake and watched closely.'),
      q('grossMotor', 'Does the baby move both arms and both legs freely?', 'Observe during a nappy change or while the baby lies safely on their back.'),
      q('grossMotor', 'While lying safely on their back, can the baby turn their head from one side towards the middle?', 'Watch during a calm, awake period without moving the baby’s head for them.'),
      q('fineMotor', 'Does the baby open their hands for short periods instead of keeping them closed all the time?', 'Notice the hands while the baby is relaxed and awake.'),
      q('fineMotor', 'Does the baby bring a hand towards their cheek or mouth during relaxed movement?', 'Observe naturally rather than placing the hand for the baby.'),
      q('fineMotor', 'When both hands come near the chest, do the fingers touch or brush against one another?', 'Watch during awake time on the back; the contact may be brief and accidental at first.')
    ]
  },
  {
    months: 4,
    label: '4-month check-in',
    intro: 'Try the activities through ordinary play. Support the baby’s head and body whenever needed.',
    questions: [
      q('personalSocial', 'Does the baby smile to begin an interaction or encourage you to keep playing?', 'Pause during face-to-face play and see whether the baby tries to draw you back in.'),
      q('personalSocial', 'Does the baby make a soft laugh or chuckle during enjoyable play?', 'Try a familiar playful voice, song or gentle game.'),
      q('personalSocial', 'Does the baby look, move or vocalise to keep a familiar adult’s attention?', 'Notice whether the baby responds when you briefly pause an enjoyable interaction.'),
      q('communication', 'Does the baby make long vowel-like sounds, such as “oo” or “ah”?', 'Listen when the baby is relaxed and interested in interacting.'),
      q('communication', 'When you speak, does the baby sometimes answer with a sound of their own?', 'Leave a short pause after speaking so the baby has a turn.'),
      q('communication', 'Does the baby turn their head or eyes towards a familiar voice?', 'Speak from one side while remaining close enough for the baby to hear comfortably.'),
      q('problemSolving', 'Does the baby study their own hands with interest?', 'This may happen while lying on the back or sitting with support.'),
      q('problemSolving', 'Can the baby follow a slowly moving toy with their eyes from one side towards the other?', 'Use a simple toy and move it steadily, not quickly.'),
      q('problemSolving', 'Does the baby reach or swing an arm towards an interesting toy?', 'Place a safe, easy-to-see toy within reaching distance.'),
      q('grossMotor', 'When held upright with support, can the baby keep their head mostly steady?', 'Support the baby’s body securely and stop if they seem tired.'),
      q('grossMotor', 'During supervised tummy time, can the baby raise their upper body on their forearms?', 'Use a firm, safe floor surface and remain beside the baby.'),
      q('grossMotor', 'When lying on their back, does the baby kick both legs with energetic, alternating movements?', 'Observe during floor play or a nappy change without pulling the legs.'),
      q('fineMotor', 'Does the baby bring one or both hands to their mouth?', 'Observe during relaxed play rather than guiding the hands.'),
      q('fineMotor', 'Can the baby keep hold of a light, easy-to-grip toy for a short time?', 'Place a baby-safe toy in an open hand and watch without shaking or pulling it.'),
      q('fineMotor', 'Does the baby bring both hands together near the middle of their body?', 'Watch while the baby lies safely on their back and looks at a person or toy.')
    ]
  },
  {
    months: 6,
    label: '6-month check-in',
    intro: 'Use safe floor play and familiar objects. Babies develop through repeated chances to move, look, listen and explore.',
    questions: [
      q('personalSocial', 'Does the baby respond differently to familiar people than to people they do not know?', 'Look for recognition through smiling, excitement, calmness or close attention.'),
      q('personalSocial', 'Does the baby laugh during a playful interaction?', 'Try a favourite game, expression or playful sound.'),
      q('personalSocial', 'Does the baby show interest in their reflection in a baby-safe mirror?', 'Place the mirror securely where the baby can see it during supervised play.'),
      q('communication', 'Can the baby take turns making sounds with another person?', 'Copy one of the baby’s sounds, pause and wait for a response.'),
      q('communication', 'Does the baby experiment with several different sounds or changes in pitch?', 'Listen for squeals, growls, bubbles, raspberries or repeated vowel sounds.'),
      q('communication', 'Does the baby use sounds to show excitement, pleasure or displeasure?', 'Think about play, feeding and when a favourite person appears.'),
      q('problemSolving', 'Does the baby deliberately reach for a toy they want?', 'Place a safe toy just within reach and allow time to try.'),
      q('problemSolving', 'Does the baby explore safe objects with hands and mouth?', 'Only use objects that are clean, too large to swallow and free from loose parts.'),
      q('problemSolving', 'Does the baby clearly show when they want a feeding pause or have had enough?', 'Look for turning away, closing the mouth or relaxing interest. Never pressure the baby to continue.'),
      q('grossMotor', 'Can the baby roll from their tummy onto their back?', 'Try on a safe floor mat while the baby is awake and supervised.'),
      q('grossMotor', 'During tummy time, can the baby push their chest up with their arms nearly straight?', 'Place an interesting toy ahead and stop when the baby becomes tired.'),
      q('grossMotor', 'When sitting on the floor, can the baby support themselves by leaning on their hands?', 'Sit close around the baby and use a clear, padded floor area.'),
      q('fineMotor', 'Can the baby close their hand around a safe toy and lift it from a nearby surface?', 'Use a light toy that is too large to swallow and place it within easy reach.'),
      q('fineMotor', 'Does the baby bring a held object towards the middle of their body to examine it?', 'Offer one uncluttered toy and allow time to look and feel.'),
      q('fineMotor', 'Does the baby use both hands together to explore one larger toy?', 'A soft ring or textured baby-safe toy works well; supervise throughout.')
    ]
  },
  {
    months: 9,
    label: '9-month check-in',
    intro: 'Give the baby time to respond before helping. Use only large, baby-safe objects and supervise food activities closely.',
    questions: [
      q('personalSocial', 'Does the baby show that familiar and unfamiliar people feel different?', 'The baby may become quiet, clingy, watchful or cautious with someone new.'),
      q('personalSocial', 'When their name is called, does the baby usually look towards the speaker?', 'Try when there are few distractions and the baby cannot already see you.'),
      q('personalSocial', 'Does the baby enjoy a familiar back-and-forth game such as hiding and reappearing?', 'Use your hands or briefly hide your own face; never cover the baby’s face.'),
      q('communication', 'Does the baby make repeated strings of consonant-like sounds?', 'Listen for changing sound strings during play, not necessarily real words.'),
      q('communication', 'Does the baby lift their arms, lean or gesture when they want to be picked up?', 'Pause before lifting and watch how the baby communicates the request.'),
      q('communication', 'Does the baby sometimes copy a simple sound you make?', 'Make one easy sound, pause and repeat the game a few times.'),
      q('problemSolving', 'If a toy falls out of view, does the baby look for where it went?', 'Drop a safe toy beside the baby where it can be found easily.'),
      q('problemSolving', 'Does the baby explore what happens by tapping or banging two safe objects together?', 'Offer two light objects that cannot break or create sharp pieces.'),
      q('problemSolving', 'Can the baby find a toy that is partly covered by a cloth?', 'Leave a clear part of the toy visible and let the baby uncover it.'),
      q('grossMotor', 'Can the baby sit steadily without being held for support?', 'Stay close on a safe floor in case the baby loses balance.'),
      q('grossMotor', 'Can the baby roll in either direction to reach a person or interesting object?', 'Use a clear floor mat and place the object where the baby can see it.'),
      q('grossMotor', 'Does the baby move from sitting towards hands-and-knees or another position without being placed there?', 'Observe natural floor play; different safe ways of moving count.'),
      q('fineMotor', 'Can the baby pass a toy from one hand to the other?', 'Offer one easy-to-hold toy at the centre of the baby’s body.'),
      q('fineMotor', 'Does the baby use their fingers to draw safe food pieces or small toys closer?', 'For food, use soft age-appropriate pieces and supervise continuously because of choking risk.'),
      q('fineMotor', 'Does the baby explore a small feature of a toy with one finger?', 'Use a toy with a safe texture, hole or fixed button and watch how the fingers investigate it.')
    ]
  },
  {
    months: 12,
    label: '12-month check-in',
    intro: 'Observe during familiar routines and play. Words do not need to sound perfect to count as meaningful communication.',
    questions: [
      q('personalSocial', 'Does the child join in with a familiar gesture game or action song?', 'Try clapping, waving or another game the child already knows.'),
      q('personalSocial', 'Does the child seek comfort or reassurance from a familiar adult when unsure?', 'Think about new places, people or a small bump during play.'),
      q('personalSocial', 'Does the child clearly show preferences for favourite people, toys or activities?', 'Look for reaching, smiling, moving closer or protesting when an activity ends.'),
      q('communication', 'Does the child use a wave or another consistent gesture to communicate?', 'Model a simple greeting or goodbye and allow time to copy.'),
      q('communication', 'Does the child use a special sound or word for a familiar person or object?', 'The sound may be an approximation as long as it is used consistently and meaningfully.'),
      q('communication', 'Does the child pause, look or respond when given a familiar limit such as “stop” or “no”?', 'Use normal everyday situations; do not create an unsafe test.'),
      q('problemSolving', 'Can the child put a toy into an open container on purpose?', 'Offer a block and a cup or box with a wide opening.'),
      q('problemSolving', 'Will the child search for an object they watched you hide?', 'Hide a favourite toy under a cloth while the child watches.'),
      q('problemSolving', 'Does the child copy a simple action with an everyday object?', 'Show brushing hair, stirring with a spoon or rolling a toy car.'),
      q('grossMotor', 'Can the child pull up to a standing position using stable furniture?', 'Use only sturdy furniture and stay close. Do not pull the child upright by the arms.'),
      q('grossMotor', 'Can the child move sideways while holding stable furniture?', 'Clear the area and place an appealing toy a short distance along the furniture.'),
      q('grossMotor', 'Can the child lower themselves from standing to the floor with some control?', 'Stay close beside stable furniture and let the child choose when to come down.'),
      q('fineMotor', 'Can the child pick up a small safe item using the thumb and fingertip?', 'Use a small piece of soft food while seated and directly supervised.'),
      q('fineMotor', 'Can the child deliberately release a toy into a wide, open container?', 'Offer a block and a bowl or box, then allow several unhurried attempts.'),
      q('fineMotor', 'Does the child use an index finger to poke, point at or explore part of a toy?', 'Choose a safe toy with interesting fixed details and follow the child’s lead.')
    ]
  },
  {
    months: 15,
    label: '15-month check-in',
    intro: 'Use familiar play and daily routines. Accept gestures, approximated words and different safe ways of completing an activity.',
    questions: [
      q('personalSocial', 'Does the child copy another person’s simple play action?', 'Try putting a block in a box, hugging a toy or pretending to stir.'),
      q('personalSocial', 'Does the child bring or hold up an object simply to share their interest with you?', 'Notice whether the child checks your face while showing the object.'),
      q('personalSocial', 'Does the child show affection to familiar people or toys?', 'This might be a cuddle, kiss, gentle pat, smile or resting close by.'),
      q('communication', 'Does the child try to use one or two meaningful words besides names for parents?', 'Consistent word approximations count if you know what the child means.'),
      q('communication', 'When you name a familiar object, does the child look towards it?', 'Name something nearby without pointing first.'),
      q('communication', 'Does the child point, reach or gesture to request something or ask for help?', 'Put a wanted object in view but safely out of reach and wait briefly.'),
      q('problemSolving', 'Does the child attempt to use familiar items for their usual purpose?', 'Offer a brush, cup, spoon, book or toy phone during play.'),
      q('problemSolving', 'Can the child place one small block or object on top of another?', 'Use stable, easy-to-stack blocks on a flat surface.'),
      q('problemSolving', 'Does the child copy a new, simple action after watching you?', 'Tap the table, roll a ball or place a toy on your head, then invite a turn.'),
      q('grossMotor', 'Can the child take several independent steps?', 'Use a clear floor and stand close without pulling the child’s hands.'),
      q('grossMotor', 'Can the child bend to collect a toy and return upright with little or no help?', 'Place a favourite toy near the feet on a clear, non-slip floor.'),
      q('grossMotor', 'Can the child change direction while walking without immediately sitting or falling?', 'Use a clear floor and invite the child to walk towards two familiar people or objects.'),
      q('fineMotor', 'Can the child pick up finger food and bring it to their mouth?', 'Use soft, age-appropriate food while the child is seated and supervised.'),
      q('fineMotor', 'Can the child make a few visible marks with a large child-safe crayon?', 'Tape paper to a table and supervise closely so the crayon is not mouthed.'),
      q('fineMotor', 'Can the child turn several sturdy book pages, even if more than one moves at a time?', 'Offer a familiar board book and let the child explore it independently.')
    ]
  },
  {
    months: 18,
    label: '18-month check-in',
    intro: 'Let the child try independently before offering help. Count skills seen naturally at home, school or childcare.',
    questions: [
      q('personalSocial', 'While exploring, does the child look back or return to check that a familiar adult is nearby?', 'Observe in a safe but slightly unfamiliar space.'),
      q('personalSocial', 'Does the child point or gesture to share something interesting, not only to request it?', 'Notice whether the child looks between the object and another person.'),
      q('personalSocial', 'Will the child look through a few book pages together with an adult?', 'Let the child control the pace and talk about whatever catches their attention.'),
      q('communication', 'Does the child try to use at least a few meaningful words besides names for parents?', 'Words may be unclear as long as they are used consistently for the same meaning.'),
      q('communication', 'Can the child follow a familiar one-step request without needing you to point?', 'Try something natural such as asking for a nearby toy.'),
      q('communication', 'Does the child attempt to copy a new word or sound after hearing it?', 'Name an interesting object once or twice, then pause without pressuring the child.'),
      q('problemSolving', 'Does the child use simple pretend play with a toy or everyday object?', 'Offer a doll, cup, spoon, toy animal or vehicle and watch how it is used.'),
      q('problemSolving', 'Does the child copy part of an everyday household action?', 'Let the child join safely with wiping, sweeping, putting away or stirring.'),
      q('problemSolving', 'Does the child play with a familiar toy in an appropriate way?', 'Examples include pushing a vehicle, stacking blocks or making marks with a crayon.'),
      q('grossMotor', 'Can the child walk across a room without holding furniture or a person?', 'Use a clear, level floor and stay nearby.'),
      q('grossMotor', 'Can the child climb onto and back down from a low, stable seat?', 'Stay close, clear the area and do not use furniture that can tip.'),
      q('grossMotor', 'Can the child walk up a few steps while holding an adult’s hand or a secure rail?', 'Use familiar enclosed steps and remain beside the child throughout.'),
      q('fineMotor', 'Does the child make marks on paper with a crayon?', 'Use a large child-safe crayon and supervise to prevent mouthing.'),
      q('fineMotor', 'Does the child attempt to drink from an open cup or eat with a spoon?', 'Small spills are expected. Use child-safe utensils and close supervision.'),
      q('fineMotor', 'Can the child place two or more blocks on top of one another?', 'Use stable blocks on a flat surface and let the child arrange them freely.')
    ]
  },
  {
    months: 24,
    label: '2-year check-in',
    intro: 'Observe the child in conversation, play and everyday movement. Different home languages all count towards communication.',
    questions: [
      q('personalSocial', 'Does the child notice when another person is hurt or upset?', 'Look for pausing, watching, changing expression or trying to help.'),
      q('personalSocial', 'In a new situation, does the child look towards a familiar adult for clues about how to respond?', 'Think about unfamiliar people, places, sounds or activities.'),
      q('personalSocial', 'Does the child play near other children and show interest in what they are doing?', 'Sharing is still developing; playing alongside another child counts.'),
      q('communication', 'Does the child put two meaningful words together?', 'Combinations in any language count, even if pronunciation is not clear.'),
      q('communication', 'Can the child point to at least two named body parts?', 'Ask during dressing, bath time or a playful song without demonstrating first.'),
      q('communication', 'When asked, can the child point to a familiar item in a picture book?', 'Ask about one clear picture on an uncluttered page.'),
      q('problemSolving', 'Does the child combine two toys in a meaningful or pretend way?', 'Examples include putting pretend food on a plate or placing a person in a toy vehicle.'),
      q('problemSolving', 'Does the child work out how to operate simple buttons, switches or knobs on a toy?', 'Offer a safe cause-and-effect toy and allow time to experiment.'),
      q('problemSolving', 'Can the child hold one object while using the other hand to complete a task?', 'Try holding a container while removing its loose lid or placing items inside.'),
      q('grossMotor', 'Can the child run with both feet leaving the ground?', 'Use an open, non-slip area and invite a short chase or “ready, steady, go” game.'),
      q('grossMotor', 'Can the child kick a stationary ball forwards?', 'Use a light, medium-sized ball in a clear space.'),
      q('grossMotor', 'Can the child walk up a few steps with a handrail or adult support?', 'Stay beside the child and use safe, familiar steps. Do not test on open or steep stairs.'),
      q('fineMotor', 'Can the child turn several book pages one at a time?', 'Use a sturdy picture book and allow the child to separate each page without rushing.'),
      q('fineMotor', 'Can the child use a spoon to bring some food to their mouth?', 'Expect spills and use a child-safe spoon while the child is seated.'),
      q('fineMotor', 'Can the child make short lines or rounded marks with a crayon?', 'Offer plain paper and a child-safe crayon without showing a required picture.')
    ]
  },
  {
    months: 30,
    label: '30-month check-in',
    intro: 'Use play, books and simple routines. Allow plenty of time for the child to understand and respond.',
    questions: [
      q('personalSocial', 'Does the child sometimes join another child’s play as well as playing nearby?', 'Watch during a familiar play opportunity without expecting long sharing.'),
      q('personalSocial', 'Does the child try to draw attention to something they have done or can do?', 'The child might use words, gestures or repeatedly check that you are watching.'),
      q('personalSocial', 'Can the child follow a familiar routine when reminded?', 'Try a normal routine such as putting toys in a basket or taking shoes to the door.'),
      q('communication', 'Does the child use a growing range of words for familiar people, objects and actions?', 'Count words across every language the child uses; exact pronunciation is not required.'),
      q('communication', 'Does the child combine words to describe an action or event?', 'Listen for combinations such as a person or object plus an action.'),
      q('communication', 'Can the child name some familiar pictures when asked?', 'Use a well-known book and ask about three clear pictures.'),
      q('problemSolving', 'Does the child use one object to represent another during pretend play?', 'For example, a block might become food, a phone or a vehicle.'),
      q('problemSolving', 'Can the child carry out a familiar request containing two connected steps?', 'Keep both steps short and related, and avoid pointing while giving the request.'),
      q('problemSolving', 'Can the child match or identify at least one familiar colour?', 'Use two or three objects of clearly different colours.'),
      q('grossMotor', 'Can the child jump so that both feet leave the floor together?', 'Try on a clear, non-slip floor and demonstrate once if needed.'),
      q('grossMotor', 'Can the child run and then slow down or stop without falling most of the time?', 'Use a clear outdoor or indoor space and keep the game unhurried.'),
      q('grossMotor', 'Can the child manage a few steps using a rail, placing a foot securely before the next step?', 'Remain beside the child on familiar, enclosed stairs.'),
      q('fineMotor', 'Can the child turn pages one at a time in a board book or picture book?', 'Start with sturdy pages that are easy to separate.'),
      q('fineMotor', 'Can the child twist a loose lid or turn a simple handle using their hands?', 'Use a safe container with an easy lid; keep small pieces out of reach.'),
      q('fineMotor', 'Can the child copy a short vertical or horizontal line on paper?', 'Draw one clear line, provide a separate crayon and invite the child to make their own.')
    ]
  },
  {
    months: 36,
    label: '3-year check-in',
    intro: 'Use familiar play and conversation. A child may show skills differently across home, nursery and other settings.',
    questions: [
      q('personalSocial', 'After a familiar adult leaves, can the child usually settle with support within a short time?', 'Think about typical childcare, nursery or family separations rather than one unusual day.'),
      q('personalSocial', 'Does the child notice other children and attempt to join their play?', 'The child might copy the play, offer an object or use words to enter.'),
      q('personalSocial', 'Can the child take a short turn in a simple activity with adult help?', 'Try rolling a ball, adding blocks to a tower or taking turns in a song.'),
      q('communication', 'Can the child take part in a brief back-and-forth conversation?', 'Look for at least two exchanges on the same topic, using any language.'),
      q('communication', 'Does the child ask questions to find out about people, objects or places?', 'Listen for question words or another clear way of asking for information.'),
      q('communication', 'Can familiar people understand most of what the child says?', 'Consider everyday conversation, not only rehearsed phrases.'),
      q('problemSolving', 'After watching a demonstration, can the child copy a rough circle on paper?', 'Draw one large circle slowly, then give the child a separate turn.'),
      q('problemSolving', 'Can the child describe what a person or animal is doing in a picture?', 'Use a clear action picture and ask what is happening.'),
      q('problemSolving', 'Does the child respond to a familiar safety warning about something hot or dangerous?', 'Base this on real routines; never create a dangerous test.'),
      q('grossMotor', 'Can the child run around an object and change direction without frequently falling?', 'Set out one soft marker in a clear space and turn it into a simple follow-me game.'),
      q('grossMotor', 'Can the child jump forwards a short distance with both feet?', 'Use a flat, non-slip surface and mark a small pretend puddle to cross.'),
      q('grossMotor', 'Can the child walk up familiar steps while using a rail and needing little physical help?', 'Stay beside the child and let them choose a comfortable pace.'),
      q('fineMotor', 'Can the child thread several large items onto a lace or cord?', 'Use oversized beads or pasta and a short child-safe lace under supervision.'),
      q('fineMotor', 'Can the child put on one simple item of clothing with limited help?', 'Loose trousers, a coat or slip-on shoes are suitable; fasteners are not required.'),
      q('fineMotor', 'Can the child use a fork to pick up some food?', 'Use child-safe cutlery while seated and supervised. Spills are expected.')
    ]
  },
  {
    months: 48,
    label: '4-year check-in',
    intro: 'Invite the child to show skills through conversation, imaginative play, drawing and active movement. Avoid turning it into a test.',
    questions: [
      q('personalSocial', 'Does the child take on roles or characters during pretend play?', 'Offer open-ended props and listen for the child’s own ideas.'),
      q('personalSocial', 'Does the child seek out other children or ask to join their play?', 'Think about parks, preschool, family gatherings or other familiar settings.'),
      q('personalSocial', 'Does the child respond when another person is hurt or sad?', 'The response might be words, a hug, finding an adult or offering a comforting object.'),
      q('communication', 'Does the child regularly use sentences containing four or more words?', 'Count sentences in any language the child uses.'),
      q('communication', 'Can the child tell you about at least one thing that happened during their day?', 'Ask an open question and allow time; the event does not need to be told in perfect order.'),
      q('communication', 'Can the child answer a simple question about what a familiar object is used for?', 'Ask about something common, such as a cup, coat, toothbrush or crayon.'),
      q('problemSolving', 'Can the child name or consistently match several colours?', 'Use familiar toys or art materials without giving answer choices first.'),
      q('problemSolving', 'Can the child suggest what happens next in a very familiar story or routine?', 'Pause before a well-known part and invite the child to continue.'),
      q('problemSolving', 'When drawing a person, does the child include at least three recognisable body parts?', 'Let the child draw freely without adding parts for them.'),
      q('grossMotor', 'Can the child catch a large, gently thrown ball on several attempts?', 'Stand close and throw softly towards the child’s hands or body.'),
      q('grossMotor', 'Can the child hop at least once on either foot?', 'Use a clear, level surface and let the child choose which foot to try.'),
      q('grossMotor', 'Can the child go up and down familiar steps while holding a rail and staying balanced?', 'Remain close enough to help and avoid open or steep stairs.'),
      q('fineMotor', 'Does the child hold a crayon or pencil with fingers and thumb rather than a full fist most of the time?', 'Observe during ordinary drawing; do not force a particular grip.'),
      q('fineMotor', 'Can the child manage a simple fastener or help serve food with supervision?', 'Try an easy button, loose zip, spooning food or pouring a small amount from a light jug.'),
      q('fineMotor', 'Can the child copy a simple cross made from two intersecting lines?', 'Draw one large example slowly, then give the child clean paper for their own attempt.')
    ]
  },
  {
    months: 60,
    label: '5-year check-in',
    intro: 'Use relaxed conversation, games and everyday responsibilities. The child should feel invited to show what they know, not examined.',
    questions: [
      q('personalSocial', 'Can the child follow simple rules and take turns in a game with other people?', 'Choose a short, familiar game with only a few rules.'),
      q('personalSocial', 'Does the child enjoy performing a song, dance, joke or pretend scene for someone?', 'The child may perform alone or as part of a group.'),
      q('personalSocial', 'Can the child complete a small, familiar household or classroom responsibility?', 'Examples include matching socks, clearing an unbreakable item or returning materials.'),
      q('communication', 'Can the child tell a short story containing at least two connected events?', 'The story may be remembered or invented and does not need perfect grammar.'),
      q('communication', 'Can the child keep a conversation going through several back-and-forth turns?', 'Talk about a preferred topic and use open questions.'),
      q('communication', 'Can the child recognise or suggest simple rhyming words?', 'Try playful word pairs and accept made-up words that genuinely rhyme.'),
      q('problemSolving', 'Can the child count a set of up to ten objects, touching or moving each object once?', 'Use blocks or other small safe items arranged where each can be counted.'),
      q('problemSolving', 'Does the child use time words such as yesterday, tomorrow, morning or night in a meaningful way?', 'Listen during plans, routines and conversations about past events.'),
      q('problemSolving', 'Can the child stay involved in a chosen story, puzzle or art activity for roughly five to ten minutes?', 'Use a non-screen activity the child enjoys and allow ordinary brief pauses.'),
      q('grossMotor', 'Can the child hop several times on one foot without holding on?', 'Use a clear, level surface and let the child choose either foot.'),
      q('grossMotor', 'Can the child balance on one foot for several seconds?', 'Let the child stand near a wall or adult without using them unless balance is lost.'),
      q('grossMotor', 'Can the child skip, gallop or use another repeating step pattern across a short space?', 'Demonstrate as part of a playful movement game on a clear surface.'),
      q('fineMotor', 'Can the child manage some buttons or a zip when dressing?', 'Choose clothing with easy fasteners and allow time before helping.'),
      q('fineMotor', 'Can the child use child-safe scissors to cut along a short, broad line?', 'Supervise closely and use paper plus rounded, age-appropriate scissors.'),
      q('fineMotor', 'Can the child copy a square or another simple closed shape?', 'Draw one large example, then offer fresh paper without tracing the child’s hand.')
    ]
  }
];

const CATEGORY_ORDER = ['communication', 'grossMotor', 'fineMotor', 'problemSolving', 'personalSocial'];

AGE_SETS.forEach(ageSet => {
  ageSet.questions.sort((first, second) => CATEGORY_ORDER.indexOf(first.category) - CATEGORY_ORDER.indexOf(second.category));
});

function q(category, prompt, direction) {
  return { category, prompt, direction };
}
