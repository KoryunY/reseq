import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    PanResponder,
    Animated,
    TouchableOpacity,
} from 'react-native';

type Photo = {
    id: number;
    source: any;
    x: Animated.Value;
    y: Animated.Value;
};

const PhotoConstructor: React.FC = () => {
    const initialPhotos = [
        { id: 1, source: require('../../assets/images/icon.png') },
        { id: 2, source: require('../../assets/images/eating-cat.png') },
        { id: 3, source: require('../../assets/images/zombie-cat.png') },
        { id: 4, source: require('../../assets/images/plant.png') },
        { id: 5, source: require('../../assets/images/splash-icon.png') },
        { id: 6, source: require('../../assets/images/react-logo.png') },
        { id: 7, source: require('../../assets/images/partial-react-logo.png') },
        { id: 8, source: require('../../assets/images/girl.png') },
        { id: 9, source: require('../../assets/images/boy.png') },
    ].map((photo) => ({
        ...photo,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
    }));

    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [grid, setGrid] = useState<Array<number | null>>(Array(9).fill(null));
    const [isCorrect, setIsCorrect] = useState(false);

    const checkCompletion = (newGrid: Array<number | null>) => {
        const correctOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const isCorrectPlacement = correctOrder.every((id, index) => newGrid[index] === id);
        setIsCorrect(isCorrectPlacement);
    };

    const panResponder = (photo: Photo) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                photo.x.setValue(gestureState.dx);
                photo.y.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                const dropIndex = getDropZoneIndex(gestureState.moveX, gestureState.moveY);
                if (dropIndex !== -1) {
                    const newGrid = [...grid];
                    newGrid[dropIndex] = photo.id;
                    setGrid(newGrid);
                    checkCompletion(newGrid);
                }

                // Reset position
                Animated.spring(photo.x, { toValue: 0, useNativeDriver: false }).start();
                Animated.spring(photo.y, { toValue: 0, useNativeDriver: false }).start();
            },
        });

    const getDropZoneIndex = (x: number, y: number) => {
        const gridSize = 3;
        const cellSize = 100;
        const margin = 10;
        const offsetX = 50; // Adjust based on grid position
        const offsetY = 50;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellX = offsetX + col * (cellSize + margin);
                const cellY = offsetY + row * (cellSize + margin);

                if (x > cellX && x < cellX + cellSize && y > cellY && y < cellY + cellSize) {
                    return row * gridSize + col;
                }
            }
        }
        return -1;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>
                Drag and drop the photos into the correct positions!
            </Text>

            <View style={styles.grid}>
                {grid.map((photoId, index) => (
                    <View key={index} style={styles.cell}>
                        {photoId !== null && (
                            <Image
                                source={initialPhotos.find((photo) => photo.id === photoId)?.source}
                                style={styles.cellImage}
                            />
                        )}
                    </View>
                ))}
            </View>

            {!isCorrect && (
                <View style={styles.stackContainer}>
                    {photos.map((photo) => (
                        <Animated.View
                            key={photo.id}
                            style={[
                                styles.photo,
                                { transform: [{ translateX: photo.x }, { translateY: photo.y }] },
                            ]}
                            {...panResponder(photo).panHandlers}
                        >
                            <Image source={photo.source} style={styles.photoImage} />
                        </Animated.View>
                    ))}
                </View>
            )}

            {isCorrect && (
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default PhotoConstructor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    instructions: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 330,
        height: 330,
        marginBottom: 20,
    },
    cell: {
        width: 100,
        height: 100,
        margin: 5,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellImage: {
        width: '100%',
        height: '100%',
    },
    stackContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    photo: {
        width: 80,
        height: 80,
        margin: 5,
        position: 'absolute',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
