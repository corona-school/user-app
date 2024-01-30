import { Achievement_State } from '../gql/graphql';
import FivePuzzlePieces from '../assets/images/achievements/five-puzzle-pieces.png';
import ThreePuzzlePieces from '../assets/images/achievements/three-puzzle-pieces.png';

const customSort = (a: Achievement_State, b: Achievement_State): number => {
    const order = [Achievement_State.Completed, Achievement_State.Active, Achievement_State.Inactive];

    return order.indexOf(a) - order.indexOf(b);
};

enum PuzzlePieceType {
    FIVE = 'five',
    THREE = 'three',
}
const getPuzzleEmptyState = (piecesCount: PuzzlePieceType): string => {
    let image: string = '';
    switch (piecesCount) {
        case PuzzlePieceType.FIVE:
            image = FivePuzzlePieces;
            break;
        case PuzzlePieceType.THREE:
            image = ThreePuzzlePieces;
            break;
        default:
            image = PuzzlePieceType.THREE;
    }
    return image;
};

export { customSort, PuzzlePieceType, getPuzzleEmptyState };
