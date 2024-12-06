import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5; // 5 rows
const CELL_SIZE = width / GRID_SIZE; // Dynamic cell size
const PLANT_COST = 2;

type CellContent = 'plant' | null;

interface Zombie {
    row: number;
    col: number;
    health: number;
}

interface Bullet {
    row: number;
    col: number;
}

const GameScreen: React.FC = () => {
    const [grid, setGrid] = useState<CellContent[][]>(
        Array(GRID_SIZE)
            .fill(null)
            .map(() => Array(GRID_SIZE).fill(null)) // 5x5 grid initialized to null
    );
    const [resources, setResources] = useState<number>(10);
    const [health, setHealth] = useState<number>(5);
    const [zombies, setZombies] = useState<Zombie[]>([]);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [score, setScore] = useState<number>(0);

    // Spawn zombies at intervals
    useEffect(() => {
        const zombieInterval = setInterval(() => {
            setZombies((prevZombies) => [
                ...prevZombies,
                {
                    row: Math.floor(Math.random() * GRID_SIZE),
                    col: GRID_SIZE - 1,
                    health: 3, // Each zombie starts with 3 health
                },
            ]);
        }, 2000);

        return () => clearInterval(zombieInterval);
    }, []);

    // Update game state (zombies move, plants shoot)
    useEffect(() => {
        const gameLoop = setInterval(() => {
            // Move zombies left
            setZombies((prevZombies) =>
                prevZombies
                    .map((zombie) => ({
                        ...zombie,
                        col: zombie.col - 1,
                    }))
                    .filter((zombie) => zombie.col >= 0)
            );

            // Plants shoot bullets
            setBullets((prevBullets) => [
                ...prevBullets,
                ...grid.flatMap((row, rowIndex) =>
                    row.map((cell, colIndex) =>
                        cell === 'plant'
                            ? { row: rowIndex, col: colIndex + 1 }
                            : null
                    ).filter(Boolean) as Bullet[]
                ),
            ]);

            // Move bullets right
            setBullets((prevBullets) =>
                prevBullets
                    .map((bullet) => ({
                        ...bullet,
                        col: bullet.col + 1,
                    }))
                    .filter((bullet) => bullet.col < GRID_SIZE)
            );

            // Check collisions
            setZombies((prevZombies) =>
                prevZombies.filter((zombie) => {
                    const bulletHit = bullets.find(
                        (bullet) =>
                            bullet.row === zombie.row && bullet.col === zombie.col
                    );

                    if (bulletHit) {
                        zombie.health -= 1;
                        if (zombie.health <= 0) {
                            setScore((prevScore) => prevScore + 10); // Add score
                        }
                    }

                    return zombie.health > 0;
                })
            );
        }, 500);

        return () => clearInterval(gameLoop);
    }, [bullets, zombies]);

    const handleCellPress = (row: number, col: number) => {
        if (resources >= PLANT_COST && !grid[row][col]) {
            const newGrid = grid.map((r, rowIndex) =>
                r.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col ? 'plant' : cell
                )
            );
            setGrid(newGrid);
            setResources((prev) => prev - PLANT_COST);
        }
    };

    return (
        <View style={styles.container}>
            {/* Stats */}
            <View style={styles.statsContainer}>
                <Text style={styles.statText}>Resources: {resources}</Text>
                <Text style={styles.statText}>Health: {health}</Text>
                <Text style={styles.statText}>Score: {score}</Text>
            </View>

            {/* Game Grid */}
            <View style={styles.grid}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <TouchableOpacity
                            key={`${rowIndex}-${colIndex}`}
                            style={styles.cell}
                            onPress={() => handleCellPress(rowIndex, colIndex)}
                        >
                            {cell === 'plant' && (
                                <Image
                                    source={require('../../assets/images/plant.png')}
                                    style={styles.plantImage}
                                />
                            )}
                            {zombies.some(
                                (zombie) =>
                                    zombie.row === rowIndex &&
                                    zombie.col === colIndex
                            ) && (
                                    <Image
                                        source={require('../../assets/images/zombie-cat.png')}
                                        style={styles.zombieImage}
                                    />
                                )}
                        </TouchableOpacity>
                    ))
                )}
                {bullets.map((bullet, index) => (
                    <View
                        key={index}
                        style={[
                            styles.bullet,
                            {
                                top: bullet.row * CELL_SIZE + CELL_SIZE / 2 - 5,
                                left: bullet.col * CELL_SIZE + CELL_SIZE / 2 - 5,
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        paddingTop: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 10,
    },
    statText: {
        color: 'white',
        fontSize: 16,
    },
    grid: {
        width: '100%',
        aspectRatio: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plantImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    zombieImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    bullet: {
        position: 'absolute',
        width: 10,
        height: 10,
        backgroundColor: 'yellow',
        borderRadius: 5,
    },
});
