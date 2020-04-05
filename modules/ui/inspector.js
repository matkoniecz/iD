import { select as d3_select } from 'd3-selection';

import { uiEntityEditor } from './entity_editor';
import { uiViewOnOSM } from './view_on_osm';


export function uiInspector(context) {
    var entityEditor = uiEntityEditor(context);
    var editorPane = d3_select(null);
    var _state = 'select';
    var _entityIDs;
    var _newFeature = false;


    function inspector(selection, presets) {

        entityEditor
            .state(_state)
            .entityIDs(_entityIDs);

        if (presets) {
            entityEditor.presets(presets);
        }

        editorPane = selection.selectAll('.entity-editor-pane')
            .data([0]);

        var enter = editorPane.enter()
            .append('div')
            .attr('class', 'entity-editor-pane');

        editorPane = editorPane.merge(enter);

        editorPane.call(entityEditor);

        var footer = selection.selectAll('.footer')
            .data([0]);

        footer = footer.enter()
            .append('div')
            .attr('class', 'footer')
            .merge(footer);

        footer
            .call(uiViewOnOSM(context)
                .what(context.hasEntity(_entityIDs.length === 1 && _entityIDs[0]))
            );
    }

    inspector.setPreset = function(preset) {

        editorPane
            .call(entityEditor.presets([preset]));
    };

    inspector.state = function(val) {
        if (!arguments.length) return _state;
        _state = val;
        entityEditor.state(_state);

        // remove any old field help overlay that might have gotten attached to the inspector
        context.container().selectAll('.field-help-body').remove();

        return inspector;
    };


    inspector.entityIDs = function(val) {
        if (!arguments.length) return _entityIDs;
        _entityIDs = val;
        return inspector;
    };


    inspector.newFeature = function(val) {
        if (!arguments.length) return _newFeature;
        _newFeature = val;
        return inspector;
    };


    return inspector;
}
