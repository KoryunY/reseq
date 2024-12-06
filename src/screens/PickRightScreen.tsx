import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    PanResponder,
    Animated,
} from 'react-native';

type Figure = {
    id: number;
    type: 'correct' | 'incorrect';
    x: Animated.Value;
    y: Animated.Value;
};

const PickRightScreen: React.FC = () => {
    const [figures, setFigures] = useState<Figure[]>([
        { id: 1, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0) },
        { id: 2, type: 'correct', x: new Animated.Value(0), y: new Animated.Value(0) },
        { id: 3, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0) },
        { id: 4, type: 'correct', x: new Animated.Value(0), y: new Animated.Value(0) },
    ]);

    const [message, setMessage] = useState<string>('');
    const [dropZoneLayout, setDropZoneLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const [trashCanLayout, setTrashCanLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const handleDropZoneLayout = (event: any) => {
        const layout = event.nativeEvent.layout;
        setDropZoneLayout({
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height,
        });
    };

    const handleTrashCanLayout = (event: any) => {
        const layout = event.nativeEvent.layout;
        setTrashCanLayout({
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height,
        });
    };

    const isInsideDropZone = (gesture: any) => {
        if (!dropZoneLayout) return false;
        const { moveX, moveY } = gesture;
        return (
            moveX > dropZoneLayout.x &&
            moveX < dropZoneLayout.x + dropZoneLayout.width &&
            moveY > dropZoneLayout.y &&
            moveY < dropZoneLayout.y + dropZoneLayout.height
        );
    };

    const isInsideTrashCan = (gesture: any) => {
        if (!trashCanLayout) return false;
        const { moveX, moveY } = gesture;
        return (
            moveX > trashCanLayout.x &&
            moveX < trashCanLayout.x + trashCanLayout.width &&
            moveY > trashCanLayout.y &&
            moveY < trashCanLayout.y + trashCanLayout.height
        );
    };

    const panResponder = (figure: Figure) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                figure.x.setValue(gestureState.dx);
                figure.y.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isInsideDropZone(gestureState)) {
                    if (figure.type === 'correct') {
                        setMessage('Correct choice!');
                        setFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
                    } else {
                        setMessage('Invalid choice! Try again or dispose.');
                    }
                } else if (isInsideTrashCan(gestureState)) {
                    setMessage('Disposed!');
                    setFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
                } else {
                    // Reset position
                    Animated.spring(figure.x, { toValue: 0, useNativeDriver: false }).start();
                    Animated.spring(figure.y, { toValue: 0, useNativeDriver: false }).start();
                }
            },
        });

    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>Drag the correct figure to the white square or dispose invalid ones in the trash can!</Text>

            <View style={styles.dropZone} onLayout={handleDropZoneLayout} />
            <View style={styles.trashCan} onLayout={handleTrashCanLayout}>
                <Text style={styles.trashText}>🗑️ Trash</Text>
            </View>

            <View style={styles.stackContainer}>
                {figures.map((figure) => (
                    <Animated.View
                        key={figure.id}
                        style={[
                            styles.figure,
                            { transform: [{ translateX: figure.x }, { translateY: figure.y }] },
                        ]}
                        {...panResponder(figure).panHandlers}
                    >
                        <Image
                            source={
                                figure.type === 'correct'
                                    ? require('../../assets/images/correct.png')
                                    : require('../../assets/images/incorrect.png')
                            }
                            style={styles.image}
                        />
                    </Animated.View>
                ))}
            </View>

            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

export default PickRightScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    instructions: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    dropZone: {
        width: 150,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    trashCan: {
        width: 150,
        height: 150,
        backgroundColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    trashText: {
        color: 'white',
        fontSize: 18,
    },
    stackContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    figure: {
        position: 'absolute',
        width: 100,
        height: 100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    message: {
        color: 'yellow',
        fontSize: 18,
        marginVertical: 10,
    },
});
