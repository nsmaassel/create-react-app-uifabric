import React, {useEffect, useState} from 'react';
import {
    Breadcrumb,
    Coachmark,
    DefaultButton,
    DirectionalHint,
    Dropdown,
    IBreadcrumbItem,
    IButtonProps,
    Icon,
    IDividerAsProps,
    IDropdownOption,
    IDropdownStyles, IIconProps,
    initializeIcons,
    PrimaryButton, TeachingBubble,
    TeachingBubbleContent,
    TooltipHost
} from 'office-ui-fabric-react';
import msftLogo from './assets/microsoftLogoLight.png';
import styles from './App.module.scss';
import businessCentral from './data/businessCentralSteps.json';
import {useBoolean} from '@uifabric/react-hooks';

// Fixes missing chevron in dropdown menu
initializeIcons();

// https://developer.microsoft.com/en-us/fluentui#/controls/web/dropdown
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {width: 300},
};

const options: IDropdownOption[] = [
    {key: 1, text: 'Welcome'},
    {key: 2, text: 'Understand the health of your business'},
    {key: 3, text: 'Simplified process with Excel integration'},
    {key: 4, text: 'Improved communication with Outlook integration'},
    {key: 5, text: 'Intuitive features to drive efficiency'},
    {key: 6, text: 'Summary'},
];

const screenExpandIcon: IIconProps = {iconName: 'FullScreen'};
const screenCollapseIcon: IIconProps = {iconName: 'BackToWindow'};

interface IProgramStep {
    stepNumber: number,
    stepName: string,
    stepDetails: string,
    stepImageUrl: string,
    coachMarkCoordinates: number[]
    stepInstructions?: string
}

interface IProgramTour {
    title: string,
    stepCount: number,
    steps: IProgramStep[]
}

interface tourStateProps {
    fullscreenMode: boolean,
    currentTour: IProgramTour,
    currentStep: IProgramStep
}

export const App: React.FunctionComponent = () => {
    const [state, setState] = useState<tourStateProps>({
        fullscreenMode: false,
        currentTour: businessCentral,
        currentStep: businessCentral.steps[0],
    });

    // TODO: Get click working
    // https://developer.microsoft.com/en-us/fluentui#/controls/web/breadcrumb
    const items: IBreadcrumbItem[] = [
        {
            text: 'Dynamics',
            key: 's0',
            onClick: () => {
                // TODO: Go to dynamics page
            }
        },
        {
            text: 'Business Central',
            key: 's1',
            onClick: () => {
                // TODO: Go to business central page
            }
        },
        {
            text: state.currentStep.stepName,
            key: 's2', onClick: () => {
            },
            isCurrentItem: true
        },
    ];

    const incrementStep = () => {
        let currentStepNumber = state.currentStep.stepNumber;

        let nextStep = state.currentTour.steps[currentStepNumber];

        setState({
            ...state,
            currentStep: nextStep
        });

        onStepChange();
    }

    const decrementStep = () => {
        let currentStepNumber = state.currentStep.stepNumber;

        let nextStep = state.currentTour.steps[currentStepNumber - 2];

        setState({
            ...state,
            currentStep: nextStep
        });

        onStepChange();
    }

    const targetButton = React.useRef<HTMLDivElement>(null);
    const [isCoachmarkVisible, {setFalse: hideCoachmark, setTrue: showCoachmark}] = useBoolean(true);
    const [coachmarkPosition, setCoachmarkPosition] = React.useState<DirectionalHint>(DirectionalHint.bottomAutoEdge);
    const [isTeachingBubbleVisible, {setFalse: hideTeachingBubble, setTrue: showTeachingBubble}] = useBoolean(false);
    // const [isTeachingBubbleVisible, setIsTeachingBubbleVisible] = useState(false);

    const onStepChange = React.useCallback(
        (): void => {
            setCoachmarkPosition(DirectionalHint.bottomAutoEdge);
        },
        [],
    );

    useEffect(() => {
        console.log('Current step update: useEffect');

    }, [state.currentStep])

    const positioningContainerProps = React.useMemo(
        () => ({
            directionalHint: coachmarkPosition,
            doNotLayer: false,
        }),
        [state.currentStep],
    );

    const prevButtonProps: IButtonProps = {
        text: '< Prev',
        onClick: () => {
            decrementStep()
        },
    };

    const nextButtonProps: IButtonProps = {
        text: 'Next >',
        onClick: () => {
            incrementStep()
        },
    };

    return (
        <div className={styles.tourContainer}>
            <div className={styles.header}>
                <div className={styles.titleContainer}>
                    <img src={msftLogo} className={styles.logoIcon} alt={'Microsoft'}/>
                    <div className={styles.title}>{state.currentTour.title} Guided Tour</div>
                </div>

                <div className={styles.buttons}>
                    <DefaultButton
                        className={styles.requestTrialButton}
                        text="Request a trial"
                        onClick={() => {
                        }}
                        allowDisabledFocus
                    />
                    <DefaultButton
                        className={styles.displayModeButton}
                        text={state.fullscreenMode ? "Standard Mode" : "Full Screen Mode"}
                        onClick={() => {
                            setState({
                                ...state,
                                fullscreenMode: !state.fullscreenMode
                            })
                        }}
                        allowDisabledFocus
                        iconProps={state.fullscreenMode ? screenCollapseIcon : screenExpandIcon}
                    />
                </div>
            </div>
            <div className={styles.body}>
                {!state.fullscreenMode &&
                <div className={styles.leftPane}>
                    <Breadcrumb
                        className={styles.breadcrumbs}
                        items={items}
                        dividerAs={_getCustomDivider}
                        onRenderOverflowIcon={_getCustomOverflowIcon}
                    />
                    <Dropdown
                        placeholder="Guided Tour Section Menu"
                        options={options}
                        styles={dropdownStyles}
                        selectedKey={state.currentStep.stepNumber}
                        onChanged={(item, key) => setState({
                            ...state,
                            currentStep: state.currentTour.steps[key ? key : 1],
                        })}
                    />
                    <p className={styles.stepTitle}>{state.currentStep.stepName}</p>
                    <p>Step {state.currentStep.stepNumber} of {state.currentTour.stepCount}</p>
                    <p>{state.currentStep.stepDetails}
                    </p>
                    {state.currentStep.stepInstructions &&
                    <p className={styles.stepInstructions}>
                        {state.currentStep.stepInstructions}
                    </p>
                    }
                    {state.currentStep.stepNumber > 1 ?
                        <DefaultButton
                            className={styles.prevButton}
                            text="< Back"
                            onClick={() => {
                                decrementStep()
                            }}
                        /> : <></>
                    }
                    {state.currentStep.stepNumber < state.currentTour.stepCount ?
                        <PrimaryButton
                            className={styles.nextButton}
                            text="Next >"
                            onClick={() => {
                                incrementStep()
                            }}
                        /> : <></>
                    }
                </div>
                }
                <div className={styles.rightPane}>
                    <img
                        src={require(`./assets/${state.currentTour.title.toLowerCase().replace(/\s+/g, '')}/${state.currentStep.stepNumber}.png`)}
                        alt={state.currentStep.stepName}
                        className={styles.stepImage}
                    />

                    {/*Hidden by transparency, just used for coachmark positioning/target*/}
                    <div
                        className={styles.buttonContainer}
                        ref={targetButton}
                        style={{
                            left: state.currentStep.coachMarkCoordinates[0] + '%',
                            top: state.currentStep.coachMarkCoordinates[1] + '%',
                        }}
                    >
                        <DefaultButton
                            id='markerButton'
                            className={styles.markerButton}
                            onClick={showCoachmark}
                            text={isCoachmarkVisible ? 'Hide coachmark' : 'Show coachmark'}
                        >{state.currentStep.stepNumber}</DefaultButton>
                    </div>

                    {state.currentTour.steps.map((step) => {
                        return (
                            state.currentStep.stepNumber === step.stepNumber ? (
                            <Coachmark
                                target={'#markerButton'}
                                positioningContainerProps={positioningContainerProps}
                                preventDismissOnLostFocus={true}
                                preventFocusOnMount={true}
                            >
                                {
                                    // state.fullscreenMode &&
                                    // isTeachingBubbleVisible &&
                                    <TeachingBubbleContent
                                        headline={step.stepName}
                                        secondaryButtonProps={step.stepNumber > 1 ? prevButtonProps : undefined}
                                        primaryButtonProps={step.stepNumber < state.currentTour.stepCount ? nextButtonProps : undefined}
                                        hasCloseIcon={!state.fullscreenMode}
                                        onDismiss={() => {
                                            hideCoachmark();
                                            hideTeachingBubble();
                                        }
                                        }
                                    >
                                        <p>Step {step.stepNumber} of {state.currentTour.stepCount}</p>
                                        <p>{step.stepDetails}
                                        </p>
                                        {step.stepInstructions &&
                                        <p className={styles.stepInstructions}>
                                            {step.stepInstructions}
                                        </p>
                                        }
                                    </TeachingBubbleContent>
                                }
                            </Coachmark>
                            ) : <></>
                        )
                    })}
                        </div>
                        </div>
                        </div>
                        )
                        ;
                    }
                    ;

                    function _onBreadcrumbItemClicked(ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem): void {
                    console.log(`Breadcrumb item with key "${item.key}" has been clicked.`);
                }

                    function _getCustomOverflowIcon(): JSX.Element {
                    return <Icon iconName={'ChevronDown'}/>;
                }

                    function _getCustomDivider(dividerProps: IDividerAsProps): JSX.Element {
                    const tooltipText = dividerProps.item ? dividerProps.item.text : '';
                    return (
                    <TooltipHost content={`Show ${tooltipText} contents`} calloutProps={{gapSpace: 0}}>
                    <span aria-hidden="true" style={{cursor: 'pointer', padding: 5}}>
                    /
                    </span>
                    </TooltipHost>
                    );
                }
