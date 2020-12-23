import React, {useState} from 'react';
import {
    Breadcrumb, Coachmark,
    DefaultButton,
    Dropdown,
    IBreadcrumbItem,
    Icon,
    IDividerAsProps,
    IDropdownOption,
    IDropdownStyles,
    initializeIcons,
    PrimaryButton,
    TooltipHost
} from 'office-ui-fabric-react';
import msftLogo from './assets/microsoftLogoLight.png';
import styles from './App.module.scss';
import businessCentral from './data/businessCentralSteps.json';

// Fixes missing chevron in dropdown menu
initializeIcons();

// https://developer.microsoft.com/en-us/fluentui#/controls/web/dropdown
const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: {width: 300},
};

const options: IDropdownOption[] = [
    {key: '1', text: 'Welcome'},
    {key: '2', text: 'Understand the health of your business'},
    {key: '3', text: 'Simplified process with Excel integration'},
    {key: '4', text: 'Improved communication with Outlook integration'},
    {key: '5', text: 'Intuitive features to drive efficiency'},
    {key: '6', text: 'Summary'},
];

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

    function incrementStep() {
        let currentStepNumber = state.currentStep.stepNumber;

        let nextStep = state.currentTour.steps[currentStepNumber];

        setState({
            ...state,
            currentStep: nextStep
        });
    }

    function decrementStep() {
        let currentStepNumber = state.currentStep.stepNumber;

        let nextStep = state.currentTour.steps[currentStepNumber - 2];

        setState({
            ...state,
            currentStep: nextStep
        });
    }

    const markerTarget = React.useRef<HTMLDivElement>(null);

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
                        allowDisabledFocus/>
                    <DefaultButton
                        className={styles.displayModeButton}
                        text="Full Screen Mode"
                        onClick={() => {
                        }}
                        allowDisabledFocus/>
                </div>
            </div>
            <div className={styles.body}>
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
                    />
                    <p className={styles.stepTitle}>{state.currentStep.stepName}</p>
                    <p>Step {state.currentStep.stepNumber} of {state.currentTour.stepCount}</p>
                    <p>Dynamics 365 Business Central is designed to empower you to make quicker,
                        better-informed decisions. With deep integration with tools like Outlook and Excel,
                        an intuitive interface, and AI-driven insights, Business Central makes it easy to manage sales,
                        inventory, and other processes as you chart your business growth.
                    </p>
                    <p className={styles.stepInstructions}>
                        Select the dot or the Next button to progress to the next step.
                    </p>
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
                <div className={styles.rightPane}>
                    <img
                        src={require(`./assets/${state.currentTour.title.toLowerCase().replace(/\s+/g, '')}/${state.currentStep.stepNumber}.png`)}
                        alt={state.currentStep.stepName}
                        className={styles.stepImage}
                    />
                    {/*<Coachmark target={markerLight}/>*/}
                </div>
            </div>
        </div>
    );
};

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
