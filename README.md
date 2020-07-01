<b>An implementation of Gomoku (or 5-in-a-row) game written Javascript with P5.js library</b>

Rules:
  - A 15x15 board is displayed at the beginning of every game.
  - Human player starts first and is indicated with a red 'X', and computer player is indicated with a green 'O'.
  - Whoever forms an exact five consecutive 'X' or 'O' (with no block on two ends) will win.
  
Source of reference: 
  - Heuristic Function: http://cs.oswego.edu/~yxia/coursework/csc466/project/paper.pdf
  - Minimax w/ α-β prunning: https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-4-alpha-beta-pruning/
  - Negamax: https://medium.com/@indykidd/joys-of-minimax-and-negamax-ee5e456977e2
  - Negascout/PVS (improved α-β prunning): https://en.wikipedia.org/wiki/Principal_variation_search
