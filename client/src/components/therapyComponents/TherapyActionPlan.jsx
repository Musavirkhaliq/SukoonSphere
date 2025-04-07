import React, { useState } from 'react';
import { FaCheckCircle, FaRegCircle, FaSpinner, FaClipboardList } from 'react-icons/fa';
import customFetch from '@/utils/customFetch';
import { toast } from 'react-toastify';
import './TherapyComponents.css';

const TherapyActionPlan = ({ actionPlans, sessionId, sessionStatus }) => {
  const [updatingTask, setUpdatingTask] = useState(null);
  
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  
  // Handle task completion toggle
  const handleTaskToggle = async (actionPlanIndex, taskIndex, completed) => {
    // Create a unique ID for this task
    const taskId = `${actionPlanIndex}-${taskIndex}`;
    
    // Don't allow toggling if already updating or session is completed
    if (updatingTask === taskId || sessionStatus !== 'active') return;
    
    setUpdatingTask(taskId);
    
    try {
      await customFetch.patch('/therapy/action-plans/tasks', {
        sessionId,
        actionPlanIndex,
        taskIndex,
        completed: !completed
      });
      
      // Update is handled by the parent component through re-fetching
      toast.success(completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdatingTask(null);
    }
  };
  
  // If no action plans exist
  if (!actionPlans || actionPlans.length === 0) {
    return (
      <div className="therapy-empty-action-plans">
        <div className="therapy-empty-icon">
          <FaClipboardList />
        </div>
        <h3>No Action Plans Yet</h3>
        <p>
          As you continue your therapy sessions, your therapist will create personalized action plans 
          to help you achieve your goals. These plans will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="therapy-action-plans">
      {actionPlans.map((plan, planIndex) => (
        <div key={planIndex} className="therapy-action-plan">
          <div className="therapy-action-plan-header">
            <h3>{plan.title}</h3>
            <span className="therapy-action-plan-date">
              Created on {formatDate(plan.createdAt)}
            </span>
          </div>
          
          <div className="therapy-action-plan-description">
            {plan.description}
          </div>
          
          <div className="therapy-action-plan-tasks">
            <h4>Tasks</h4>
            
            {plan.tasks.length === 0 ? (
              <p className="therapy-no-tasks">No tasks defined for this plan</p>
            ) : (
              <ul>
                {plan.tasks.map((task, taskIndex) => {
                  const taskId = `${planIndex}-${taskIndex}`;
                  const isUpdating = updatingTask === taskId;
                  
                  return (
                    <li 
                      key={taskIndex} 
                      className={`therapy-task ${task.completed ? 'completed' : ''}`}
                    >
                      <button 
                        className="therapy-task-checkbox"
                        onClick={() => handleTaskToggle(planIndex, taskIndex, task.completed)}
                        disabled={isUpdating || sessionStatus !== 'active'}
                      >
                        {isUpdating ? (
                          <FaSpinner className="spin" />
                        ) : task.completed ? (
                          <FaCheckCircle />
                        ) : (
                          <FaRegCircle />
                        )}
                      </button>
                      
                      <div className="therapy-task-content">
                        <div className="therapy-task-text">{task.task}</div>
                        {task.dueDate && (
                          <div className="therapy-task-due-date">
                            Due: {formatDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TherapyActionPlan;
