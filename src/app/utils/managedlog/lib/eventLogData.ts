import EventNode from './eventLogNode';
import {EventObject} from './apollo11types';
import eventLogIsDifferent from './objectDifference';

export default class eventLogDataObject {
  eventHead: EventNode | null;

  eventTail: EventNode | null;

  constructor() {
    this.eventHead = null;
    this.eventTail = null;
  }

  setEventHead(content: EventNode) {
    if (this.eventHead === null) {
      this.eventHead = content;
      this.eventTail = content;
    } else {
      this.insertEventLogBefore(this.eventHead, content);
    }
  }

  addEventLog(content: EventNode) {
    if (this.eventTail === null) {
      this.setEventHead(content);
    } else {
      this.insertEventLogAfter(this.eventTail, content);
    }
  }

  insertEventLogBefore(content: EventNode, nodeToInsert: EventNode) {
    if (this.isNodeTailAndHead(nodeToInsert)) return;
    const [insertContent, insertNode] = [content, nodeToInsert]; // make a copy of mutable argument
    this.removeEventLogNode(insertContent);
    insertNode.prev = insertContent.prev;
    insertNode.next = insertContent;
    if (insertContent.prev === null) {
      this.eventHead = insertNode;
    } else {
      insertContent.prev.next = insertNode;
    }
    insertContent.prev = insertNode;
  }

  insertEventLogAfter(content: EventNode, nodeToInsert: EventNode) {
    if (this.isNodeTailAndHead(nodeToInsert)) return;
    const [insertContent, insertNode] = [content, nodeToInsert]; // make a copy of mutable argument
    this.removeEventLogNode(insertContent);
    insertNode.prev = insertContent;
    insertNode.next = insertContent.next;
    if (insertContent.next === null) {
      this.eventTail = insertNode;
    } else {
      insertContent.next.prev = insertNode;
    }
  }

  insertEventLogAtPosition(position: number, nodeToInsert: EventNode) {
    if (position === 1) {
      this.setEventHead(nodeToInsert);
    } else {
      let eNode = this.eventHead;
      let currentPosition = 1;
      while (eNode !== null && currentPosition !== position) {
        eNode = eNode.next;
        currentPosition += 1;
      }
      if (eNode !== null) {
        this.insertEventLogBefore(eNode, nodeToInsert);
      } else {
        this.addEventLog(nodeToInsert);
      }
    }
  }

  removeEventLogNodesWithContent(content: EventObject) {
    let eNode = this.eventHead;
    while (eNode !== null) {
      const proposedToRemove = eNode;
      eNode = eNode.next;
      if (eventLogIsDifferent(eNode.content, content))
        this.removeEventLogNode(proposedToRemove);
    }
  }

  removeEventLogNode(content: EventNode) {
    if (content === this.eventHead) this.eventHead = this.eventHead.next;
    if (content === this.eventTail) this.eventTail = this.eventTail.prev;
    // cleanup removed EventNode pointers
    // this.removeEventNodePointers(content);
  }

  containsEventNodeWithContent(content: EventObject) {
    if (!content) {
      let eNode = this.eventHead;
      while (eNode !== null && !eventLogIsDifferent(eNode.content, content)) {
        eNode = eNode.next;
      }
      return eNode === null;
    }
    return false;
  }

  isNodeTailAndHead(nodeToInsert: EventNode) {
    return nodeToInsert === this.eventHead && nodeToInsert === this.eventTail;
  }

  // removeEventNodePointers(content: EventNode) {
  //   if (content.prev !== null) content.prev.next = content.next;
  //   if (content.next !== null) content.next.prev = content.prev;
  //   content.prev = null;
  //   content.next = null;
  // }
}
