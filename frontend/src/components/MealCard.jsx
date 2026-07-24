import React, { useState, useEffect } from 'react';
import { getMealDateStatus } from '../utils/dateUtils';

export default function MealCard({ dateStr, initialMeals, onSave }) {
    const [meals, setMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        ...initialMeals
    });
    const [isSaved, setIsSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const status = getMealDateStatus(dateStr); 
    // status can be: 'past', 'today', 'locked', 'editable', 'future_locked'

    useEffect(() => {
        if (initialMeals) {
            setMeals(initialMeals);
            // যদি আগে থেকে কোনো মিল সিলেক্ট করা থাকে এবং দিনটি এডিটেবল হয়, তবে শুরুতেই সেভড স্টেট দেখাব
            if (initialMeals.breakfast || initialMeals.lunch || initialMeals.dinner) {
                setIsSaved(true);
            }
        }
    }, [initialMeals]);

    const handleCheckboxChange = (mealType) => {
        if (status !== 'editable' || (isSaved && !isEditing)) return;
        setMeals(prev => ({ ...prev, [mealType]: !prev[mealType] }));
    };

    const handleSave = async () => {
        const success = await onSave(dateStr, meals);
        if (success) {
            setIsSaved(true);
            setIsEditing(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(false);
    };

    // সুন্দর করে ডেট ফরম্যাট করা (যেমন: Monday, July 20)
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div style={styles.card}>
            <h3 style={styles.header}>Your meals for {formattedDate}</h3>

            {/* Breakfast Option */}
            <div 
                style={{
                    ...styles.mealOption,
                    ...(meals.breakfast ? styles.mealSelected : {})
                }}
                onClick={() => handleCheckboxChange('breakfast')}
            >
                <span>Breakfast</span>
                <input 
                    type="checkbox" 
                    checked={meals.breakfast} 
                    disabled={status !== 'editable' || (isSaved && !isEditing)}
                    onChange={() => {}} 
                    style={styles.checkbox}
                />
            </div>

            {/* Lunch Option */}
            <div 
                style={{
                    ...styles.mealOption,
                    ...(meals.lunch ? styles.mealSelected : {})
                }}
                onClick={() => handleCheckboxChange('lunch')}
            >
                <span>Lunch</span>
                <input 
                    type="checkbox" 
                    checked={meals.lunch} 
                    disabled={status !== 'editable' || (isSaved && !isEditing)}
                    onChange={() => {}} 
                    style={styles.checkbox}
                />
            </div>

            {/* Dinner Option */}
            <div 
                style={{
                    ...styles.mealOption,
                    ...(meals.dinner ? styles.mealSelected : {})
                }}
                onClick={() => handleCheckboxChange('dinner')}
            >
                <span>Dinner</span>
                <input 
                    type="checkbox" 
                    checked={meals.dinner} 
                    disabled={status !== 'editable' || (isSaved && !isEditing)}
                    onChange={() => {}} 
                    style={styles.checkbox}
                />
            </div>

            {/* Actions & Status Sections */}
            {status === 'editable' && (
                <div style={styles.actionArea}>
                    {(!isSaved || isEditing) ? (
                        <button style={styles.saveButton} onClick={handleSave}>
                            Save Meal Selection
                        </button>
                    ) : (
                        <div style={styles.successContainer}>
                            <div style={styles.successBadge}>
                                <span>✓ Saved — your meals for {formattedDate} are set</span>
                            </div>
                            <p style={styles.subtext}>
                                Need to make changes? You can update your selection anytime before 10:00 PM.
                            </p>
                            <button style={styles.editButton} onClick={handleEdit}>
                                Change Selection
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Locked States UI */}
            {status === 'locked' && (
                <div style={styles.lockedBadge}>
                    🔒 Selection locked at 10:00 PM. No more changes allowed.
                </div>
            )}

            {(status === 'past' || status === 'today' || status === 'future_locked') && (
                <div style={styles.historySummary}>
                    <strong>Status:</strong> Read-Only History <br />
                    <span style={{ fontSize: '13px', color: '#555' }}>
                        {meals.breakfast || meals.lunch || meals.dinner 
                            ? `You chose: ${[meals.breakfast && 'Breakfast', meals.lunch && 'Lunch', meals.dinner && 'Dinner'].filter(Boolean).join(', ')}`
                            : 'No meals selected'}
                    </span>
                </div>
            )}
        </div>
    );
}

// ইনলাইন স্টাইলস (ছবির মতন গ্রিন থিম দেওয়ার চেষ্টা করা হয়েছে)
const styles = {
    card: {
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        maxWidth: '450px',
        margin: '20px auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        color: '#006644',
        fontSize: '18px',
        margin: '0 0 20px 0',
        fontWeight: 'bold'
    },
    mealOption: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 16px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    mealSelected: {
        background: '#e8f7f1',
        borderColor: '#00b074',
        fontWeight: 'bold'
    },
    checkbox: {
        accentColor: '#00b074',
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    actionArea: {
        marginTop: '20px'
    },
    saveButton: {
        width: '100%',
        background: '#00b074',
        color: '#ffffff',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    successContainer: {
        marginTop: '15px',
        textAlign: 'center'
    },
    successBadge: {
        background: '#e8f7f1',
        border: '1px solid #00b074',
        color: '#006644',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '8px'
    },
    subtext: {
        fontSize: '12px',
        color: '#666',
        margin: '5px 0 12px 0',
        lineHeight: '1.4'
    },
    editButton: {
        background: 'none',
        border: 'none',
        color: '#00b074',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    lockedBadge: {
        marginTop: '15px',
        background: '#f5f5f5',
        color: '#666',
        padding: '12px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        border: '1px solid #ddd'
    },
    historySummary: {
        marginTop: '15px',
        padding: '12px',
        background: '#f9f9f9',
        borderRadius: '8px',
        fontSize: '14px',
        borderLeft: '4px solid #00b074'
    }
};