// Adapted from https://github.com/pmndrs/react-nil/blob/master/src/index.js
// @ts-ignore
import Reconciler from "react-reconciler";

const Renderer = Reconciler({
    clearContainer: () => {},
    supportsMutation: true,
    isPrimaryRenderer: true,
    now: () => Date.now(),
    createInstance(): any {
        return null;
    },
    appendInitialChild() {},
    appendChild() {},
    appendChildToContainer() {},
    insertBefore() {},
    removeChild() {},
    removeChildFromContainer() {},
    commitUpdate() {},
    getPublicInstance(instance: any) {
        return instance;
    },
    getRootHostContext() {
        return emptyObject;
    },
    getChildHostContext() {
        return emptyObject;
    },
    createTextInstance() {},
    finalizeInitialChildren() {
        return false;
    },
    prepareUpdate() {
        return emptyObject;
    },
    shouldDeprioritizeSubtree() {
        return false;
    },
    prepareForCommit(): any {
        return null;
    },
    resetAfterCommit() {},
    shouldSetTextContent() {
        return false;
    },
    schedulePassiveEffects(callback: any) {
        callback();
    },
    cancelPassiveEffects(_callback: any) {},
});

const root = Renderer.createContainer({}, 0, false, null);
const emptyObject = {};

// Behold ... 💩

export function render(element: React.ReactElement) {
    Renderer.updateContainer(element, root, null, undefined);
    return Renderer.getPublicRootInstance(root);
}
