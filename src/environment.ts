declare let PLAYGROUND: any;

export const Config: IGlobalConfig = PLAYGROUND;

const banner =
    `....###....########..########..........####.##....##....########..##..........###....##....##..######...########...#######..##.....##.##....##.########.
...##.##...##.....##.##.....##..........##..###...##....##.....##.##.........##.##....##..##..##....##..##.....##.##.....##.##.....##.###...##.##.....##
..##...##..##.....##.##.....##..........##..####..##....##.....##.##........##...##....####...##........##.....##.##.....##.##.....##.####..##.##.....##
.##.....##.##.....##.##.....##.#######..##..##.##.##....########..##.......##.....##....##....##...####.########..##.....##.##.....##.##.##.##.##.....##
.#########.##.....##.##.....##..........##..##..####....##........##.......#########....##....##....##..##...##...##.....##.##.....##.##..####.##.....##
.##.....##.##.....##.##.....##..........##..##...###....##........##.......##.....##....##....##....##..##....##..##.....##.##.....##.##...###.##.....##
.##.....##.########..########..........####.##....##....##........########.##.....##....##.....######...##.....##..#######...#######..##....##.########.`;

console.groupCollapsed('About');
console.log(banner);
console.log(Config);
console.groupEnd();
