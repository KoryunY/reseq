import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    GestureHandlerStateChangeEvent,
    GestureHandlerGestureEvent,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { RootStackParamList } from '../../app';

// Image sources array for puzzles
const imageSources = [
    require('../../assets/images/puzzle1.png'),
    require('../../assets/images/puzzle2.png'),
    require('../../assets/images/puzzle3.png'),
    require('../../assets/images/puzzle4.png'),
    require('../../assets/images/puzzle5.png'),
    require('../../assets/images/puzzle6.png'),
    require('../../assets/images/puzzle7.png'),
    require('../../assets/images/puzzle8.png'),
    require('../../assets/images/puzzle9.png'),
];

// Types for the component
type PhotoConstructorProps = {
    navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
};

const PhotoConstructor: React.FC<PhotoConstructorProps> = ({ navigation }) => {
    const [puzzleImages, setPuzzleImages] = useState(imageSources);
    const [puzzleState, setPuzzleState] = useState<Array<any>>(Array(9).fill(null)); // tracks positions
    const [completed, setCompleted] = useState(false);

    // Function to check if puzzle is solved
    const checkCompletion = () => {
        if (puzzleState.every((img, idx) => img === imageSources[idx])) {
            setCompleted(true);
        }
    };

    // Handle drop event in a square
    const onDrop = (index: number, droppedImage: any) => {
        const newPuzzleState = [...puzzleState];
        newPuzzleState[index] = droppedImage;
        setPuzzleState(newPuzzleState);
        checkCompletion();
    };

    // Handle drag event
    const onGestureEvent = (event: GestureHandlerGestureEvent) => {
        console.log(event);
    };

    const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.state === 4) {
            // Handle the drop when the drag ends
            console.log('Drop finished');
        }
    };

    // Shuffle images for the stack
    const shuffledImages = [...puzzleImages].sort(() => Math.random() - 0.5);

    return (
        <GestureHandlerRootView style={styles.container}>
            {!completed ? (
                <>
                    {/* Grid of squares */}
                    <View style={styles.gridContainer}>
                        {Array(9)
                            .fill(null)
                            .map((_, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.square}
                                    onPress={() => onDrop(idx, shuffledImages[idx])}
                                >
                                    {puzzleState[idx] && (
                                        <Image source={puzzleState[idx]} style={styles.squareImage} />
                                    )}
                                </TouchableOpacity>
                            ))}
                    </View>

                    {/* Stack of shuffled puzzle images */}
                    {/* <View style={styles.stackContainer}>
                        {shuffledImages.map((image, idx) => (
                            <PanGestureHandler
                                key={idx}
                                onGestureEvent={onGestureEvent}
                                onHandlerStateChange={onHandlerStateChange}
                            >
                                <View style={styles.stackImageWrapper}>
                                    <Image source={image} style={styles.stackImage} />
                                </View>
                            </PanGestureHandler>
                        ))}
                    </View> */}

                    {/* White outlined black square */}
                    {/* <View style={styles.outlinedSquare} /> */}
                </>
            ) : (
                // When puzzle is completed
                <View style={styles.completedContainer}>
                    <Image source={require('../../assets/images/puzzle.png')} style={styles.completedImage} />
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CirclesScreen")}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    square: {
        width: 90,
        height: 90,
        borderWidth: 2,
        borderColor: '#000',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    squareText: {
        color: '#000',
        fontSize: 18,
    },
    squareImage: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#000',
    },
    stackContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    stackImageWrapper: {
        marginBottom: 10,
    },
    stackImage: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#000',
    },
    outlinedSquare: {
        width: 100,
        height: 100,
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    completedContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default PhotoConstructor;
