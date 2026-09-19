import { RefObject, useEffect } from 'react';

import { Flex, Segmented } from 'antd';

import EmailPreviewPane from './EmailPreviewPane';
import HtmlCodeMirrorEditor, { HtmlEditorHandle } from './HtmlCodeMirrorEditor';

type MainWorkspaceTab = 'html' | 'preview';

// The HTML editor intentionally uses a fixed height rather than stretching to
// fill the workspace — a code editor doesn't benefit from unbounded height,
// and Preview (which does benefit from all the room it can get) shares this
// same container, so letting the editor stretch would just be empty editor
// chrome. Long HTML still scrolls inside this fixed area.
const HTML_EDITOR_HEIGHT = 420;

type MainWorkspaceProps = {
    html: string;
    onHtmlChange: (value: string) => void;
    sampleDataRaw: string;
    htmlEditorRef: RefObject<HtmlEditorHandle>;
    activeTab: MainWorkspaceTab;
    onActiveTabChange: (tab: MainWorkspaceTab) => void;
};

const MainWorkspace = ({
    html,
    onHtmlChange,
    sampleDataRaw,
    htmlEditorRef,
    activeTab,
    onActiveTabChange,
}: MainWorkspaceProps) => {
    useEffect(() => {
        if (activeTab === 'html') htmlEditorRef.current?.layout();
    }, [activeTab, htmlEditorRef]);

    return (
        <Flex vertical gap={12} className="h-full min-h-0">
            <Segmented
                options={[
                    { label: 'HTML', value: 'html' },
                    { label: 'Preview', value: 'preview' },
                ]}
                value={activeTab}
                onChange={value => onActiveTabChange(value as MainWorkspaceTab)}
            />
            {/* Both panes stay mounted at all times (visibility toggled via CSS) so the
                CodeMirror instance and its undo history/cursor position are preserved
                when switching to Preview and back, rather than being torn down and
                rebuilt. `flex-1 min-h-0` lets this fill whatever space the editor
                workspace row above allocates it — Preview uses all of it; the HTML
                editor below deliberately doesn't (see HTML_EDITOR_HEIGHT). */}
            <div className="flex-1 min-h-0 relative">
                <div className={`absolute inset-0 ${activeTab === 'html' ? 'block' : 'hidden'}`}>
                    <div
                        style={{ height: HTML_EDITOR_HEIGHT }}
                        className="border border-borderGray rounded-md overflow-hidden"
                    >
                        <HtmlCodeMirrorEditor
                            ref={htmlEditorRef}
                            value={html}
                            onChange={onHtmlChange}
                        />
                    </div>
                </div>
                <div className={`absolute inset-0 ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                    <EmailPreviewPane templateHtml={html} sampleDataRaw={sampleDataRaw} />
                </div>
            </div>
        </Flex>
    );
};

export default MainWorkspace;
